# Stage 1: Build the React frontend
FROM node:20.13.1 AS frontend
WORKDIR /app
COPY wos-interactive-map-front/package*.json ./wos-interactive-map-front/
RUN npm install --prefix wos-interactive-map-front
COPY wos-interactive-map-front ./wos-interactive-map-front
RUN npm run build --prefix wos-interactive-map-front

# Stage 2: Build and run backend server
FROM node:20.13.1
WORKDIR /app

# Copy backend package files and install dependencies
COPY wos-interactive-map-back/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY wos-interactive-map-back/src ./src
COPY wos-interactive-map-back/package*.json ./

# Copy frontend build output from frontend stage into backend public dir
COPY --from=frontend /app/wos-interactive-map-front/dist ./public

# Use non-root user for safety
USER node

ENV HOST=0.0.0.0
ENV PORT=5000
EXPOSE 5000

CMD ["node", "src/index.js"]
