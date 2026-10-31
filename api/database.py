from infrastructure.database.sqlite_connection import init_database

if __name__ == "__main__":
    init_database()
    print("Banco de dados SQLite inicializado com sucesso!")
