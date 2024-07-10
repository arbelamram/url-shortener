# URL Shortener Service

![NodeJS](https://img.shields.io/badge/NodeJs-yellow.svg)
![NodeJS](https://img.shields.io/badge/Express-green.svg)
![Build Status](https://img.shields.io/badge/MongoDB-brightgreen.svg)
![ReactJs](https://img.shields.io/badge/ReactJs-blue.svg)
![License](https://img.shields.io/badge/license-MIT-black.svg)

### Overview

The URL Shortener Service is a web application built with the MERN stack (MongoDB, Express.js, React, Node.js) designed to provide users with a simple and efficient way to shorten long URLs. This service aims to streamline sharing and managing web links by converting lengthy URLs into compact, easy-to-share versions. Key features include generating unique short URLs, redirecting users to the original URLs, and tracking usage statistics. The project addresses the need for a reliable and user-friendly URL shortening tool, filling a gap in the availability of customizable and robust URL shorteners.

![Screenshot 2024-07-09 180521](https://github.com/arbelamram/url-shortener/assets/51449659/cafc531d-a671-4572-8195-5ad9cbdf487c)

## Table of Contents

1. [Description](#description)
   - [Features](#features)
   - [Technologies Used](#technologies-used)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
3. [Usage](#usage)
   - [Running the Application](#running-the-application)
   - [API Endpoints](#api-endpoints)
4. [Contributing](#contributing)
5. [Contact](#contact)
6. [Acknowledgments](#acknowledgments)
7. [License](#license)


## Description

The URL Shortener Service offers a user-friendly platform to convert long URLs into short, manageable links. This project is ideal for anyone who needs to share URLs on social media, emails, or any platform where character space is limited. Additionally, the service provides analytics to track the usage of the shortened URLs, helping users understand their audience better.

### Features

#### Core Functionality

- **URL Shortening**: Convert long URLs into short, easy-to-share links.
- **Redirection**: Redirect users from the short URL to the original URL seamlessly.

#### Major Feature

- **URL Management**: Users can view, edit, and delete their shortened URLs.

#### Technical Capabilities

- **MERN Stack**: Utilizes MongoDB, Express.js, React, and Node.js.
- **RESTful API**: Provides a robust and scalable API for URL management.

### Technologies Used

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://reactjs.org/)

## Getting Started

### Prerequisites

Ensure you have the following software and tools installed:

- Node.js v14.x or higher
- npm v6.x or higher
- MongoDB v4.x or higher

### Installation

Follow these steps to set up the project:

1. Clone the repository:

   ```sh
   git clone https://github.com/username/repo.git
   cd repo
   ``` 

2. Install dependencies:

   ```sh
   npm install 
   ```
   * Run npm install in both the client and server directories

### Configuration

Create a `.env` file in root directory and configure the project using the environment variables:

```sh
PORT=5000
MONGODB_URI=<YOUR_CLUSTER_CONNECTION>
```

## Usage

### Running the Application

1. Start the development server:

   ```sh
   cd client
   npm start
   cd ../server
   npm run dev
   ```

2. The application should now be running at `http://localhost:3000`

### API Endpoints

#### URLs

- `POST /api/url` - Create short URL
- `GET /api/urls` - Recieve all URLs
- `PUT /api/url/:id` - Update long URL by ID
- `DELETE /api/url/:id` - Delete URL by ID

#### Using the REST Client Extension
To simplify testing of API endpoints, I recommend using the 'REST Client' extension by Huachao Mao in VSCode. You can find the API requests pre-configured for testing in the following file:

```sh
URL_SHORTENER/server/requests/api.http
```

Feel free to install the extension and start testing the API endpoints right away.

## Contributing

To contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## Contact

If you have any questions or suggestions, feel free to reach out:

- Email: [ArbelAmram@gmail.com](mailto:arbelamram@gmail.com)

## Acknowledgments

- Resources:
  - [Badges](https://shields.io/badge)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
