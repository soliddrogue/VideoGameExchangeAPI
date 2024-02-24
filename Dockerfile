# Use an official Node.js runtime as a base image for your Node.js app
FROM node:14

# Set the working directory in the container for your app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables for your app
ENV NODE_ENV=production
ENV DATABASE_HOST=mongodb://your_mongo_host:2717/
ENV DATABASE_NAME=Games
ENV DATABASE_USER=savyab
ENV DATABASE_PASSWORD=megan2002

# Expose the port your app will run on
EXPOSE 3001

# Command to run your application
CMD ["npm", "start"]