# Use a base image with Node.js installed
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install Redis
RUN apt-get update && apt-get install -y redis-server supervisor

# Copy the supervisord configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy tsconfig.json
COPY tsconfig.json ./

# Copy source code
COPY src ./src

# Install app dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the necessary ports
EXPOSE 8080 6379

# Define the command to start supervisord
CMD [ "/usr/bin/supervisord", "-c", "./supervisord.conf" ]
