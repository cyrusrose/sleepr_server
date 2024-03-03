# launching mongodb
docker run --name mongodb -p '27017:27017' -v mongodb_data:/bitnami/mongodb bitnami/mongodb:5.0

# build for production
docker build . -f ./apps/reservations/Dockerfile -t reservations
docker build . -f ./apps/auth/Dockerfile -t auth
docker build . -f ./apps/notifications/Dockerfile -t notifications
docker build . -f ./apps/payments/Dockerfile -t payments

# docker compose
docker compose up -V

# k8s
kubectl create deployment reservations --image=reservations --dry-run=client -o yaml > deployment.yaml

kubectl create secret generic mongodb --from-literal=MONGODB_URI=mongodb://mongo:27017/sleepr --dry-run=client -o yaml > mongodb.yaml

kubectl apply -f ./secrets/mongodb.yaml

kubectl create configmap reservations --from-file ../apps/reservations/.env --dry-run=client -o yaml > ./sleepr/templates/reservations/configmap.yaml

kubectl logs auth-deployment-65d4dc646c-jvtwk

kubectl get po --watch

helm install sleepr .

helm upgrade sleepr .

kubectl create service clusterip notifications --tcp=3000 --dry-run=client -o yaml > ./sleepr/templates/notifications/service.yaml

kubectl get svc

kubectl rollout restart deployment notifications

# proto

protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/notifications.proto
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/auth.proto
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/payments.proto