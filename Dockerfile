FROM node:18.16.0-alpine as base

COPY package.json ./

RUN npm install

COPY . .

COPY tsconfig.json ./tsconfig.json

RUN npm run build

FROM node:18.16.0-alpine

# Copy node modules and build directory from base image to new image
COPY --from=base ./node_modules ./node_modules
COPY --from=base ./package.json ./package.json
COPY --from=base /dist /dist

# Expose port 3000, and start the app.
EXPOSE 4000
CMD ["node", "dist/app.js"]