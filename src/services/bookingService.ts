import { request } from "./apiClient";

export type Period = "morning" | "afternoon" | "evening";
export type InvestorProfile = "" | "conservative" | "moderate" | "aggressive";

export interface BookingPayload {
  full_name: string;
  email: string;
  phone: string;
  objective: string;
  preferred_date: string;
  preferred_period: Period;
  investor_profile?: InvestorProfile | null;
}

export interface BookingResponse {
  status: string;
  message: string;
  id: string;
}

export interface BookingItem extends BookingPayload {
  id: string;
  created_at: string;
}

export interface BookingListResponse {
  bookings: BookingItem[];
}

export async function createBooking(payload: BookingPayload): Promise<BookingResponse> {
  return request<BookingResponse>("/api/agendar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listBookings(): Promise<BookingListResponse> {
  return request<BookingListResponse>("/api/agendamentos");
}

