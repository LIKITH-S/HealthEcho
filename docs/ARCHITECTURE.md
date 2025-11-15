# Architecture

This document outlines the high-level architecture of the Healthecho system, including frontend, backend, microservices, data stores, and integration points.

- Frontend: React (Vite) single-page app.
- Backend: Node.js + Express API layer.
- Microservices: NLP (Python/Flask), Chatbot (Rasa + Flask), Notification (Flask handlers), Translation (Flask).
- Database: PostgreSQL (recommended) with migrations and seeds.
- Communication: REST APIs between services; consider gRPC for high-throughput components.

(Placeholder — expand with diagrams, ER models, sequence flows.)
