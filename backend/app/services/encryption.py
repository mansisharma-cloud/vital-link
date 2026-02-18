from cryptography.fernet import Fernet
import base64
from app.core.config import settings

# In a real app, this key would be in env vars
# We derive a key from the secret key for simulation
key = base64.urlsafe_b64encode(
    settings.SECRET_KEY[:32].encode().ljust(32, b'0'))
cipher_suite = Fernet(key)


def encrypt_data(data: str) -> str:
    """Simulates HIPAA-compliant encryption."""
    if not data:
        return ""
    return cipher_suite.encrypt(data.encode()).decode()


def decrypt_data(encrypted_data: str) -> str:
    """Simulates HIPAA-compliant decryption."""
    if not encrypted_data:
        return ""
    return cipher_suite.decrypt(encrypted_data.encode()).decode()
