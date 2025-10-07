#!/bin/bash
set -e

echo "Starting OrionJobs API..."

# Skip database wait and migrations for now
# This will be handled by the application itself

# Start the application directly
exec uvicorn app.main:app --host 0.0.0.0 --port 8000