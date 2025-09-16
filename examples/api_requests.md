# API Usage Examples

> **Note**: These examples will be fully functional once the backend API is merged from the `feature/fastapi-integration` branch.

## Base URL
```
http://localhost:8000
```

## Available Endpoints

### Authentication
Currently, no authentication is required for the API endpoints.

### Jobs Management

#### Create a Job
```bash
POST /jobs
Content-Type: application/json

{
  "title": "Python Developer",
  "company": "TechCorp",
  "work_modality": "remote"
}
```

#### Get All Jobs
```bash
GET /jobs
```

#### Get Job by ID
```bash
GET /jobs/{id}
```

#### Update Job
```bash
PUT /jobs/{id}
Content-Type: application/json

{
  "title": "Senior Python Developer"
}
```

#### Delete Job
```bash
DELETE /jobs/{id}
```

## Testing with curl

Once the API is running, you can test with these curl commands:

```bash
# Create a job
curl -X POST "http://localhost:8000/jobs" \
  -H "Content-Type: application/json" \
  -d '{"title": "Python Developer", "company": "TechCorp", "work_modality": "remote"}'

# Get all jobs
curl -X GET "http://localhost:8000/jobs"

# Get specific job
curl -X GET "http://localhost:8000/jobs/1"

# Update job
curl -X PUT "http://localhost:8000/jobs/1" \
  -H "Content-Type: application/json" \
  -d '{"title": "Senior Python Developer"}'

# Delete job
curl -X DELETE "http://localhost:8000/jobs/1"
```

## API Documentation

When the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

*Full API functionality available in the `feature/fastapi-integration` branch*