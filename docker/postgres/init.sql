-- Create database if it doesn't exist
SELECT 'CREATE DATABASE insider_threat'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'insider_threat')\gexec
