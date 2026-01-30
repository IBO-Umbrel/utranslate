from flask import request, jsonify
from functools import wraps
from security import Security
from config import VALID_API_KEYS

security = Security()

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get("X-API-Key")

        if not api_key:
            return jsonify({"error": "API key missing"}), 401

        hashed = security.hash_api_key(api_key)

        if hashed not in VALID_API_KEYS:
            return jsonify({"error": "Invalid API key"}), 403

        # attach key info if needed
        # request.api_key_meta = VALID_API_KEYS[hashed]

        return f(*args, **kwargs)
    return decorated
