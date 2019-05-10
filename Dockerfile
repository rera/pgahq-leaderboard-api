### BASE
FROM node:8-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

### DEPENDENCIES
RUN npm install

### RELEASE
ENV PORT=8000
EXPOSE $PORT
ENV NODE_ENV=production
HEALTHCHECK --interval=5s \
            --timeout=5s \
            --retries=6 \
            CMD curl -fs http://localhost:$PORT/ || exit 1

### RUN
CMD ["npm", "run", "start"]
