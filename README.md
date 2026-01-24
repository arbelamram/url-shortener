# URL Shortener Service

![NodeJS](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)
![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)
![React](https://img.shields.io/badge/React-Frontend-blue.svg)
![License](https://img.shields.io/badge/license-MIT-black.svg)

---

## Overview

The **URL Shortener Service** is a full-stack web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js).  
It provides a clean, production-oriented solution for shortening long URLs, managing them via a RESTful API, and resolving short links via fast HTTP redirects.

The project focuses on **backend correctness, API design, and maintainability**, rather than being a UI-heavy demo.  
It is intentionally structured to resemble a real-world service rather than a tutorial project.

![Screenshot](https://github.com/arbelamram/url-shortener/assets/51449659/cafc531d-a671-4572-8195-5ad9cbdf487c)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
5. [Usage](#usage)
   - [Running the Application](#running-the-application)
   - [API Endpoints](#api-endpoints)
   - [Testing](#testing)
6. [Design Decisions](#design-decisions)
7. [Known Limitations & Future Improvements](#known-limitations--future-improvements)
8. [Contributing](#contributing)
9. [Contact](#contact)
10. [License](#license)

---

### Architecture Overview

The system is intentionally split into **two distinct backend responsibilities**:

### 1️⃣ REST API Layer (`/api/url`)
- Exposes a **RESTful JSON API**
- Manages URL resources (create, read, update, delete)
- Stateless, resource-based, and uses standard HTTP verbs
- Centralized error handling and async-safe routing

### 2️⃣ Redirect Layer (`/:code`)
- Handles short-link resolution
- Performs a database lookup and issues an **HTTP redirect**
- Not part of the REST API by design
- Optimized for user experience and simplicity

### High-level Flow

Client (React)
↓
REST API (/api/url)
↓
MongoDB (Atlas)
↑
Redirect Endpoint (/:code)

This separation mirrors how real URL-shortening services are typically implemented.

---

## Features

### Core Functionality
- Shorten long URLs into compact, shareable links
- Redirect short URLs to their original destinations

### URL Management
- View all shortened URLs
- Update existing URLs
- Delete URLs

### Technical Capabilities
- RESTful backend API
- Centralized error handling
- Async-safe Express routing
- Environment-based configuration (no secrets committed)

---

## Technologies Used

- **Node.js** (Express.js backend)
- **MongoDB Atlas** (persistence)
- **Mongoose** (ODM)
- **React** (frontend)
- **shortid** (URL code generation)
- **dotenv** (environment configuration)

---

## Getting Started

### Prerequisites

- Node.js **v18+** (recommended)
- npm
- MongoDB Atlas account (or compatible MongoDB instance)

---

### Installation

Clone the repository:

```sh
git clone https://github.com/arbelamram/url-shortener.git
cd url-shortener
```

#### Install dependencies:
```sh
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Configuration

All sensitive configuration is handled via environment variables.

Create a `.env` file inside the **server directory**:

```env
MONGO_USER=
MONGO_PASSWORD=
MONGO_CLUSTER=
MONGO_PROJECT=
MONGO_DOMAIN=mongodb.net
MONGO_DB=test
MONGO_OPTIONS=retryWrites=true&w=majority
```
A template is provided at:
```sh
server/.env.example
```
⚠️ Do not commit .env files — they are intentionally excluded via .gitignore.

### Usage
#### Running the Application

Start the backend server:
```sh
cd server
npm run dev
```

Start the frontend client:
```sh
cd client
npm start
```


Frontend UI: `http://localhost:3000`<br>
Backend API: `http://localhost:5000`

### API Endpoints
```md
### URL Resource (`/api/url`)

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/api/url`       | Retrieve all URLs        |
| POST   | `/api/url`       | Create a short URL       |
| PUT    | `/api/url/:id`   | Update a URL by ID       |
| DELETE | `/api/url/:id`   | Delete a URL by ID       |
```

### Redirect Endpoint
```sh
GET /:code
```

Redirects the client to the original long URL associated with the given short code.

### Testing
#### Postman

To test API endpoints using Postman:
* Set request body type to raw
* Select JSON
* Ensure header includes 

```sh
Content-Type: application/json
```

Example POST request body:
```sh
{
  "longUrl": "https://example.com"
}
```

### VS Code REST Client

Preconfigured API requests are available at:

```sh
server/requests/api.http
```

This allows quick, repeatable testing directly from VS Code.

Redirect behavior (`/:code`) should be tested via a browser.

### Design Decisions

* MongoDB was selected for schema flexibility and low operational overhead
* Redirect routes are intentionally separate from the REST API
* Centralized error handling ensures consistent responses and prevents server crashes
* Environment-based configuration prevents credential leakage and supports deployment
* Minimal frontend logic keeps focus on backend architecture and correctness

### Known Limitations & Future Improvements

The following enhancements are planned but intentionally excluded from the initial scope:

* Collision-safe URL code generation
* Unique database indexes for urlCode
* Rate limiting and abuse protection
* Click analytics and usage tracking
* URL expiration support
* Authentication and user ownership
* Automated API testing (Jest + Supertest)

### Contributing

To contribute:

1. Fork the repository
2. Create a new feature branch
3. Commit changes with clear, scoped messages
4. Open a pull request for review

### Contact
For questions or feedback:
* Email: ArbelAmram@gmail.com

##

### License

This project is licensed under the MIT License.
See the LICENSE file for details.

## Acknowledgments

This project was inspired by various open-source URL shortener implementations and tutorials.
All code was written independently.
