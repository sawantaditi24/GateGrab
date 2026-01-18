import random
import string


def generate_otp(length=6) -> str:
    """Generate a random numeric OTP"""
    return ''.join(random.choices(string.digits, k=length))


def verify_otp(provided_otp: str, stored_otp: str) -> bool:
    """Verify if the provided OTP matches the stored OTP"""
    return provided_otp == stored_otp



