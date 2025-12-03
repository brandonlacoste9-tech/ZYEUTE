FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Run
CMD ["node", "dist/engine.js"]

