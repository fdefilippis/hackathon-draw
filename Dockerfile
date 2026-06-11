FROM node:22-alpine

WORKDIR /app

# Build tool necessari per compilare better-sqlite3 (modulo nativo) su Alpine
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

# Build di produzione (no dev server, no HMR)
RUN npm run build

EXPOSE 3002

ENV PORT=3002
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
