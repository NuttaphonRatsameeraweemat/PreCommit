
FROM node:12.10.0-alpine as build
ARG env
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install 
RUN npm install react-scripts -g 
COPY . /app
RUN  npm run build:$env

# production environment
FROM nginx:1.17.4-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
