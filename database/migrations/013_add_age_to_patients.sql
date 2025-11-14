-- Migration: 013_add_age_to_patients.sql
-- Adds an `age` integer column to patients for compatibility with controllers
-- Run with your usual migration runner or directly via psql for local development.

BEGIN;

ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS age integer;

COMMIT;
