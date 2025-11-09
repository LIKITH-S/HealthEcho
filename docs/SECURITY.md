# Security Guide

Security considerations for Healthecho:

- Secrets: store JWT keys and encryption keys in a secrets manager (Vault, Azure Key Vault, AWS Secrets Manager).
- Encryption: field-level encryption for PII using AES-256. Use KMS for key management.
- Authentication: JWT with short-lived access tokens and refresh tokens. Enforce RBAC.
- Transport: enforce HTTPS/TLS for all services.
- Audit: use centralized audit logs (audit service/ELK) and immutable storage for critical events.

(Placeholder — expand with threat model and SSO/OAuth guidance.)
