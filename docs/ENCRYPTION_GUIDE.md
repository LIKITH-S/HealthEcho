# Encryption Guide

- Use AES-256-CBC for field encryption with unique IV per value.
- Store keys in a KMS and rotate periodically.
- Do not hard-code keys in repo; `.env` values are only for local dev.
- Use database functions `encrypt_field` and `decrypt_field` to centralize encryption.

(Placeholder — add examples and migration instructions.)
