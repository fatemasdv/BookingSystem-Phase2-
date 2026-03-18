# G1 – CRUD Data Flow (Booking System Phase 6)

This document models how the Booking System handles Create, Read, Update, and Delete operations.

The flows are verified using:

* Browser Developer Tools (Network tab)
* Frontend code (resources.js, form.js)
* Backend routes (resources.routes.js)

---

# Common Participants

* **User** → Browser user interacting with UI
* **Frontend (resources.js / form.js)** → Client-side JavaScript
* **Backend (resources.routes.js)** → Express API
* **Validators (resource.validators.js)** → Input validation
* **Database (PostgreSQL)** → Stores resource data
* **Log Service (log.service.js)** → Logs events

---

# 1. CREATE Operation (C)

**Endpoint:** POST `/api/resources`
**Method:** POST
**Success Status:** 201 Created
**Error Status:** 400 (Validation), 409 (Duplicate), 500 (Server)

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Frontend (form.js)
    participant Backend as Backend (resources.routes.js)
    participant Validators
    participant DB as PostgreSQL
    participant Log

    User->>Frontend: Fill form & click Create
    Frontend->>Backend: POST /api/resources

    Backend->>Validators: Validate input
    Validators-->>Backend: Validation result

    alt Validation fails
        Backend-->>Frontend: 400 Bad Request
        Frontend-->>User: Show validation errors
    else Duplicate name
        Backend-->>Frontend: 409 Conflict
        Frontend-->>User: Duplicate error
    else Success
        Backend->>DB: INSERT INTO resources
        DB-->>Backend: New resource
        Backend->>Log: Log creation
        Backend-->>Frontend: 201 Created
        Frontend-->>User: Success message
    end
```

---

# 2. READ Operation (R)

**Endpoint:** GET `/api/resources`
**Method:** GET
**Success Status:** 200 OK
**Error Status:** 500 (Server)

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Frontend (resources.js)
    participant Backend as Backend (resources.routes.js)
    participant DB as PostgreSQL

    User->>Frontend: Open resources page
    Frontend->>Backend: GET /api/resources

    alt Success
        Backend->>DB: SELECT * FROM resources
        DB-->>Backend: Resource list
        Backend-->>Frontend: 200 OK + JSON
        Frontend-->>User: Display resource list
    else Server error
        Backend-->>Frontend: 500 error
        Frontend-->>User: Show error
    end
```

---

# 3. UPDATE Operation (U)

**Endpoint:** PUT `/api/resources/:id`
**Method:** PUT
**Success Status:** 200 OK
**Error Status:** 400 (Validation), 404 (Not Found), 409 (Duplicate), 500 (Server)

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Frontend (form.js)
    participant Backend as Backend (resources.routes.js)
    participant Validators
    participant DB as PostgreSQL
    participant Log

    User->>Frontend: Click Update
    Frontend->>Backend: PUT /api/resources/:id

    Backend->>Validators: Validate input
    Validators-->>Backend: Validation result

    alt Validation fails
        Backend-->>Frontend: 400 Bad Request
        Frontend-->>User: Show validation errors
    else Resource not found
        Backend-->>Frontend: 404 Not Found
        Frontend-->>User: Resource not found
    else Duplicate name
        Backend-->>Frontend: 409 Conflict
        Frontend-->>User: Duplicate error
    else Success
        Backend->>DB: UPDATE resources
        DB-->>Backend: Updated resource
        Backend->>Log: Log update
        Backend-->>Frontend: 200 OK
        Frontend-->>User: Success message
    end
```

---

# 4. DELETE Operation (D)

**Endpoint:** DELETE `/api/resources/:id`
**Method:** DELETE
**Success Status:** 204 No Content
**Error Status:** 400 (Invalid ID), 404 (Not Found), 500 (Server)

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Frontend (form.js)
    participant Backend as Backend (resources.routes.js)
    participant DB as PostgreSQL
    participant Log

    User->>Frontend: Click Delete
    Frontend->>Backend: DELETE /api/resources/:id

    alt Invalid ID
        Backend-->>Frontend: 400 Bad Request
        Frontend-->>User: Show error
    else Resource not found
        Backend-->>Frontend: 404 Not Found
        Frontend-->>User: Resource not found
    else Success
        Backend->>DB: DELETE FROM resources
        DB-->>Backend: Row deleted
        Backend->>Log: Log deletion
        Backend-->>Frontend: 204 No Content
        Frontend-->>User: Success message
    end
```

---
