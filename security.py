import secrets
import hashlib



class Security():
    def generate_api_key(self) -> str:
        return "utranslate_" + secrets.token_hex(32)

    def hash_api_key(self, key: str) -> str:
        return hashlib.sha256(key.encode()).hexdigest()

    def verify_api_key(self, provided_key: str, stored_hashed_key: str) -> bool:
        return self.hash_api_key(provided_key) == stored_hashed_key