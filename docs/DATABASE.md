# Database Guide

Recommendation: PostgreSQL for relational data with support for JSON fields for flexible extracted data.

- Migrations: SQL files in database/migrations. Use a migration tool (Flyway, Liquibase, or node-pg-migrate).
- Seeds: place seed data in database/seeds.
- Functions: encrypt_field, decrypt_field, calculateHealthScore, getPatientEmergencyContacts.

(Placeholder — add schemas, indexes, backup, and retention policies.)
