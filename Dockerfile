# Use Node.js 20 as the base image
FROM node:23

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files into the container
COPY . .

# Expose the application on port 1338
EXPOSE 80

# Command to start the application
CMD ["npm", "run", "dev"]
