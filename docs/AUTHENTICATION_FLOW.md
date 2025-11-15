# Authentication Flow

Unified login/register for patients and doctors.

- Register: POST /api/auth/register with role (doctor|patient). Password hashed with bcrypt.
- Login: POST /api/auth/login returns access and refresh tokens (JWT).
- Protect APIs with middleware that verifies JWT and checks RBAC.

(Placeholder — add sequence diagrams and token refresh flow.)
