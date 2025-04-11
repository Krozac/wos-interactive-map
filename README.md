# WOS Interactive Map

This project is an interactive map application designed for deployment using Docker. It includes a Node.js application and a MongoDB database.

## Features
- Interactive map functionality.
- MongoDB for data storage.
- Dockerized for easy deployment.

## Prerequisites
- Docker and Docker Compose installed.
- `.env` file configured with the following variables:
  ```properties
  STATUS=production
  MONGO_URI=mongodb://mongodb:27017/mapBuildings
  ALLOWED_HOST=localhost
  APP_DEV_PORT=5000
  APP_PROD_PORT=80
  DB_DEV_PORT=27017
  DB_PROD_PORT=27017

# Setup and Deployment

1. Clone the repository:
```bash
git clone <repository-url>
cd wos-interactive-map
```

2. Start the application:
```bash
docker-compose up --build
```


3. Access the application:

- App: http://localhost:5000 (development) or http://localhost:80 (production).

- MongoDB: localhost:27017 (if exposed).

# Notes
- Ensure the .env file is not shared publicly to protect sensitive information.
- For production, secure MongoDB with authentication and restrict access.
- This is not the final version, so there may still be bugs and security issues.
