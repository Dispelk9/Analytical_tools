# hash_password.py
#!/usr/bin/env python3
import getpass
from werkzeug.security import generate_password_hash

def main():
    username = input("Enter username: ")
    password = getpass.getpass("Enter password: ")
    hashed = generate_password_hash(password)
    print(f"Username: {username}")
    print(f"Hashed password: {hashed}")

if __name__ == '__main__':
    main()