# Use an official Node.js runtime as a parent image
FROM node:20.12.1

# Update package repositories and install gnupg
RUN apt-get update && \
    apt-get install -y gnupg && \
    apt-get clean

# Set the working directory
WORKDIR /app

# Install build dependencies
RUN echo "deb http://deb.debian.org/debian buster main" > /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y \
    build-essential \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3010

# Define environment variable defaults
ENV DB_HOST=10.0.0.183.database.windows.net \
    DB_USER=IFRS_TEST \
    DB_PASSWORD=Grace$58678 \
    DB_NAME=CBUReportDB

    
# Start the app
CMD [ "npm", "start" ]
