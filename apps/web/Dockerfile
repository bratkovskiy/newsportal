FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application (Astro + node adapter)
RUN npm run build

# Expose the port the app runs on
EXPOSE 4321

# Start the Astro server
CMD ["node", "./dist/server/entry.mjs"]
