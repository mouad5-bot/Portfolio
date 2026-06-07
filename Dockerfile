# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Web3Forms key is embedded at build time (Create React App)
ARG REACT_APP_WEB3FORMS_ACCESS_KEY
ENV REACT_APP_WEB3FORMS_ACCESS_KEY=$REACT_APP_WEB3FORMS_ACCESS_KEY

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
