import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('./blog_database.db')

# Create a cursor object using the cursor() method
cursor = conn.cursor()

# Prepare SQL query to SELECT all records from the blogs table.
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
# This will fetch the list of all tables in your database.
tables = cursor.fetchall()

# Print the contents of all tables
for table in tables:
    print(f"Contents of table {table[0]}:")
    cursor.execute(f"SELECT * FROM {table[0]}")
    # Fetch and print all rows of the table.
    rows = cursor.fetchall()
    for row in rows:
        print(row)
    print("\n")  # Add a newline for better readability between tables

# Close the database connection
conn.close()
