# MySQL pfficial image
FROM mysql:latest

# custom working directory
WORKDIR /app/mysql

# environment variables
ENV MYSQL_ROOT_PASSWORD=Password
# TO DO: use different way for set password
ENV MYSQL_DATABASE=wordsdb

# Veritabanını başlatırken çalıştırılacak komut
COPY table.sql /docker-entrypoint-initdb.d/
CMD ["mysqld"]