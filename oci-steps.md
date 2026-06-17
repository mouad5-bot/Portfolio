1/ creating and compute instance in oci 
2/ configure all the things on it (including ssh connection)
3/ download ssh file - private one
4/ use it to connect with the vm 

then follow this steps to install your app in ur vm 

Step 1 — Create a buildx builder
bashdocker buildx create --name multibuilder --use
docker buildx inspect --bootstrap

Step 2 — Build and push for both platforms
bashdocker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t moufifel/portfolio:v1.0.0 \
  --push \
  .

step 3
docker pull docker.io/username/portfolio:tag

