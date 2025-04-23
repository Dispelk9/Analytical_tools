# Stage 1: Build the React app using Node
FROM node:20 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source and build the app
COPY . .
RUN npm run build

# Stage 2: Serve the build with Apache
FROM httpd:2.4-alpine

# Copy the production build from the previous stage into Apache's document root.
# Vite outputs to the "dist" folder by default.
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

# Optionally, if you want to use a custom Apache configuration, uncomment the next line
# and ensure you have an appropriate httpd.conf file in the apache folder.
COPY apache/httpd.conf /usr/local/apache2/conf/httpd.conf

# Copy the .htpasswd file into the container (place it in the same directory as referenced in httpd.conf)
# COPY apache/.htpasswd /usr/local/apache2/conf/.htpasswd

# # Copy the certs into apache container
# COPY /etc/letsencrypt/live/analytical.dispelk9.de/fullchain.pem /usr/local/apache2/conf/fullchain.pem
# COPY /etc/letsencrypt/live/analytical.dispelk9.de/privkey.pem /usr/local/apache2/conf/privkey.pem


EXPOSE 80

CMD ["httpd-foreground"]
