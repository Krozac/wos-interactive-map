# Whiteout Interactive Map

## Overview

**Whiteout Interactive Map** is a full-stack web application that provides an interactive map experience for users. Built with Node.js, Express, and MongoDB (via Mongoose), it allows users to explore, interact with, and manage map data dynamically. The project is containerized with Docker for easy deployment and scalability.

_For screenshots and a detailed app presentation, see [docs/presentation.md](docs/presentation.md)._

---

## Features

- **Interactive Map UI:** Explore and interact with a dynamic map interface.
- **Building & Location Management:** Add, edit, and view buildings or points of interest.
- **RESTful API:** Backend API for CRUD operations on map data.
- **User Authentication:** Secure endpoints and manage user sessions (no password or roles for the moment).
- **Dockerized Deployment:** Easily run the entire stack with Docker Compose.
- **Environment Configuration:** Flexible setup via `.env` file.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- (Optional) Local or cloud MongoDB instance

---

### Local Development Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd wos-interractive-map
   ```

2. **Install Dependencies**

   Install dependencies for both the backend and frontend:

   ```bash
   cd wos-interactive-map-back
   npm install

   cd ../wos-interactive-map-front
   npm install
   ```

   Return to the project root when done.

3. **Configure Environment Variables**

   Create a `.env` file in the project root with the following content:

   ```env
   MONGO_URI=mongodb://localhost:27017/mapBuildings
   PORT=5000
   ALLOWED_HOST=localhost
   ```

   - Adjust `MONGO_URI` if using a remote MongoDB.
   - Set `PORT` to your preferred port.
   - Set `ALLOWED_HOST` for CORS or domain restrictions.

4. **Start the Application**

   ```bash
   npm start
   ```

   The server will run at [http://localhost:5000](http://localhost:5000) (or your chosen port).

---

### Docker Deployment

1. **Build and Start with Docker Compose**

   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the Node.js app image.
   - Start the app and a MongoDB container.
   - Expose ports as defined in `docker-compose.yml`.

2. **Environment Variables for Docker**

   - By default, Docker Compose uses the environment variables set in `docker-compose.yml`.
   - To override, create a `.env` file or edit the `environment` section in `docker-compose.yml`.

3. **Stopping the Application**

   ```bash
   docker-compose down
   ```

---

## Usage

- Access the interactive map at [http://localhost:5000](http://localhost:5000) (or your configured host/port).
- Use the UI to view, add, or edit map buildings and locations.
- API endpoints are available for programmatic access.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests. Follow the coding standards and include clear commit messages.

---

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

## Author

Krozac

---
