FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy prisma
COPY prisma ./prisma/

# Generate Prisma client
RUN pnpm prisma generate --schema=prisma/schema.prisma

# Copy app files
COPY . .

# Build
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start
CMD ["pnpm", "run", "start"]
