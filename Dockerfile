# Use the Node.js LTS image as a base
FROM node:lts
# Set working directory to /src
WORKDIR /src

# Copy only necessary files
COPY . .


# Install app dependencies
RUN npm install

# Expose port to outside world
EXPOSE 3000

# Start command as per the package.json file
CMD ["npm", "start"]