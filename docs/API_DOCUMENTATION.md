**API Documentation**

This document describes the backend API for the frontend team: endpoints, required input for POST/PUT, headers, and representative responses as implemented in the repository.

**Auth - Overview**
- **Login (Admin)**: `POST /api/auth/admin/login`
  - **Request JSON (required):**
    - `email` : string, required, valid email
    - `password` : string, required
  - **Success Response (200):**
    ```json
    {
      "status": true,
      "message": "Success",
      "data": {
        "access_token": "<plain-text-token>",
        "token_type": "Bearer",
        "expires_at": "YYYY-MM-DD HH:MM:SS"
      }
    }
    ```
  - **Failure (401):** invalid credentials
    ```json
    {"status": false, "message": "Invalid credentials or unauthorized."}
    ```

- **Logout**: `POST /api/auth/logout` (requires `Authorization: Bearer <token>`)
  - **Headers:** `Authorization: Bearer <access_token>`
  - **Success Response (200):**
    ```json
    {
      "status": true,
      "message": "Success",
      "data": {"message": "Logged out successfully."}
    }
    ```

**Protected endpoints**
All routes below require a valid Bearer token created by the admin login and the user must be an administrator.

**Factories** (`/api/factories`) — controller returns `success` boolean in body
- **List**: `GET /api/factories`
  - Query params: `search` (optional)
  - Response (200):
    ```json
    {
      "success": true,
      "pagination": {"total": 10, "current_page": 1, "total_page": 1},
      "data": [
        {"id":1, "factory_name":"Acme", "location":"City", "email":null, "website":null, "employees_count":3}
      ]
    }
    ```

- **Create**: `POST /api/factories`
  - **Request JSON (required):**
    - `factory_name`: string, required, max:255
    - `location`: string, required, max:255
    - `email`: string, optional, valid email
    - `website`: string, optional, valid URL
  - **Success (201):** returns `data` with created factory (see DTO fields above)
  - **Validation (422):** Laravel validation errors (standard JSON validation shape)

- **Show**: `GET /api/factories/{id}`
  - Response: `data` object matching one factory

- **Update**: `PUT /api/factories/{id}`
  - Request JSON: same rules as Create (all required fields validated)
  - Response (200): updated `data` object

- **Delete**: `DELETE /api/factories/{id}`
  - Response (200):
    ```json
    {"success": true, "message": "Factory deleted successfully."}
    ```

**Employees** (`/api/employees`) — controller returns `success` boolean in body
- **List**: `GET /api/employees`
  - Query params: `search` (optional), `factory_id` (optional)
  - Response (200):
    ```json
    {
      "success": true,
      "pagination": {"total": 5, "current_page": 1, "total_page": 1},
      "data": [
        {"id":1, "firstname":"John", "lastname":"Doe", "factory_id":1, "email":null, "phone":null}
      ],
      "factories": [{"id":1, "factory_name":"Acme"}]
    }
    ```

- **Create**: `POST /api/employees`
  - **Request JSON (required):**
    - `firstname`: string, required, max:255
    - `lastname`: string, required, max:255
    - `factory_id`: integer, required, must exist in `factories` table
    - `email`: string, optional, valid email
    - `phone`: string, optional, max:50
  - **Success (201):** returns `data` with created employee

- **Show**: `GET /api/employees/{id}`
  - Response: `data` object for the employee

- **Update**: `PUT /api/employees/{id}`
  - Request JSON: same rules as Create (fields validated)
  - Response: updated `data` object

- **Delete**: `DELETE /api/employees/{id}`
  - Response (200):
    ```json
    {"success": true, "message": "Employee deleted successfully."}
    ```

**Dashboard**
- **GET /api/dashboard**
  - Response (200):
    ```json
    {
      "success": true,
      "factories": 3,
      "employees": 42,
      "logged_events": 12,
      "avg_per_factory": 14.0,
      "top_factories": [
        {"id":1, "factory_name":"Acme", "employees_count":20}
      ],
      "recent_activity": [
        {"action":"created","model":"Employee","record_id":10,"user_id":2,"changes":null,"time_ago":"2 hours ago"}
      ]
    }
    ```

**Logs**
- **GET /api/logs**
  - Query params:
    - `model` : optional filter by model name (e.g., `Factory`, `Employee`)
    - `action` : optional filter by action (`created`, `updated`, `deleted`)
  - Response (200):
    ```json
    {"success": true, "total": 10, "data": [{"action":"created","model":"Factory","record_id":1,"user_id":2,"changes":{}}]}
    ```
  - If log file not present: 404 with `{ "success": false, "message": "Log file not found." }`

**Frontend validation rules**
- `POST /api/auth/admin/login`
  - `email`: required, string, valid email
  - `password`: required, string
- `POST /api/factories` / `PUT /api/factories/{id}`
  - `factory_name`: required, string, max:255
  - `location`: required, string, max:255
  - `email`: optional, valid email, max:255
  - `website`: optional, valid URL, max:255
- `POST /api/employees` / `PUT /api/employees/{id}`
  - `firstname`: required, string, max:255
  - `lastname`: required, string, max:255
  - `factory_id`: required, integer, must exist in `factories.id`
  - `email`: optional, valid email, max:255
  - `phone`: optional, string, max:50

**General notes & headers**
- All protected routes require header: `Authorization: Bearer <access_token>`
- Content-Type for JSON bodies: `application/json`
- Validation errors: responses use HTTP status `422` and a JSON body with validation details (FormRequest default). Example shape may include `errors` key.
- If your frontend uses `withCredentials = true` or sends cookies/session credentials, the backend cannot use a wildcard origin (`*`). You must set `CORS_ALLOWED_ORIGINS` to the exact frontend origin, for example `http://localhost:5174`.
- Misc errors: controllers sometimes return `{ "success": false, "message": "..." }` or the auth helper uses `{ "status": false, ... }` — for auth endpoints rely on the `status` shape; for domain resources (factories/employees/dashboard/logs) the controllers use `success`.

**Quick curl examples**
- Login:
```
curl -X POST https://your-app.test/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"password"}'
```
- Use token for protected request:
```
curl -H "Authorization: Bearer <token>" https://your-app.test/api/dashboard
```

If you want, I can convert this into a prettier developer doc (Swagger/OpenAPI spec or Postman collection). Which format do you prefer?
