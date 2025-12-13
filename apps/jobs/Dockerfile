FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for ts-node)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on (if needed)
# EXPOSE 3001

# Start the application (uses ts-node as defined in package.json)
CMD ["npm", "run", "start"]
