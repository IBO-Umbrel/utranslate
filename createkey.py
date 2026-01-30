from security import Security

sec = Security()
key = sec.generate_api_key()

print("API KEY (show once):", key)
print("STORE HASH:", sec.hash_api_key(key))