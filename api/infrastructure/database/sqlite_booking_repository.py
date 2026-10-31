from typing import List
from domain.entities import ConsultationBooking
from domain.interfaces import IBookingRepository
from infrastructure.database.sqlite_connection import get_connection

class SqliteBookingRepository(IBookingRepository):
    """Repositório de agendamentos com persistência em SQLite."""

    def save(self, booking: ConsultationBooking) -> ConsultationBooking:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO consultation_bookings (
                id, full_name, email, phone, objective,
                investor_profile, preferred_date, preferred_period, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            booking.id,
            booking.full_name,
            booking.email,
            booking.phone,
            booking.objective,
            booking.investor_profile,
            booking.preferred_date,
            booking.preferred_period,
            booking.created_at
        ))
        conn.commit()
        conn.close()
        return booking

    def find_all(self) -> List[ConsultationBooking]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM consultation_bookings ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        bookings: List[ConsultationBooking] = []
        for row in rows:
            bookings.append(
                ConsultationBooking(
                    id=row["id"],
                    full_name=row["full_name"],
                    email=row["email"],
                    phone=row["phone"],
                    objective=row["objective"],
                    investor_profile=row["investor_profile"],
                    preferred_date=row["preferred_date"],
                    preferred_period=row["preferred_period"],
                    created_at=row["created_at"]
                )
            )
        return bookings

