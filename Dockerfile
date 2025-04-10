FROM node:20.13.1
WORKDIR /wos-app
COPY --chown=node:node package*.json ./
RUN npm ci --only=production
COPY --chown=node:node . .
USER node
EXPOSE 5000
ENV HOST=0.0.0.0 PORT=5000
CMD ["node", "app.js"]
