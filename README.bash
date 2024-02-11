# launching mongodb
docker run --name mongodb -p '27017:27017' -v mongodb_data:/bitnami/mongodb bitnami/mongodb:5.0