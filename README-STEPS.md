# Deployment guide — Docker Hub & Oracle Cloud

Step-by-step instructions to build this portfolio image, push it to Docker Hub, and run it on **Oracle Cloud Infrastructure (OCI)** using **Container Instances**.

---

## Roadmap — follow these steps in order

```
[ ] Step A — On your PC: build the Docker image
[ ] Step B — On your PC: push the image to Docker Hub
[ ] Step C — In Oracle Cloud: open port 80 on your VCN (security list)
[ ] Step D — In Oracle Cloud: create a Container Instance and point it to your Docker Hub image
[ ] Step E — Open the public IP in your browser → your site is live
```

| Step | Where | What you do |
|------|-------|-------------|
| **A + B** | Your computer | `docker build` → `docker push` → image lives on Docker Hub |
| **C** | OCI Console → your VCN | Allow HTTP (port 80) in the security list |
| **D** | OCI Console → Container Instances | Tell Oracle to download and run your image |
| **E** | Browser | Visit `http://PUBLIC_IP` |

> **Important:** Docker Hub is **not** configured inside the VCN. You build and push the image from your PC first. Oracle only **downloads** it when you create the Container Instance.

Replace placeholders with your own values:

| Placeholder | Example |
|-------------|---------|
| `YOUR_DOCKERHUB_USERNAME` | `moufifel` |
| `YOUR_IMAGE_NAME` | `portfolio` |
| `YOUR_TAG` | `latest` or `v1.0.0` |
| `YOUR_WEB3FORMS_KEY` | Your Web3Forms access key |
| `YOUR_GITHUB_REPO` | `https://github.com/mouad5-bot/Portfolio` |

---

## Part 1 — Prerequisites

### On your machine

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Git](https://git-scm.com/) installed
- A [Docker Hub](https://hub.docker.com/) account
- Your Web3Forms access key (see `.env.example`)

### On Oracle Cloud

- An OCI account (you already have one)
- Access to the [OCI Console](https://cloud.oracle.com/)
- A compartment where you can create networking and compute resources

---

## Part 2 — Build the Docker image locally

### 1. Clone the project (if not already)

```bash
git clone YOUR_GITHUB_REPO
cd Portfolio
```

### 2. Build the image

Pass your Web3Forms key at build time (required for the contact form):

```bash
docker build \
  --build-arg REACT_APP_WEB3FORMS_ACCESS_KEY=YOUR_WEB3FORMS_KEY \
  -t YOUR_DOCKERHUB_USERNAME/YOUR_IMAGE_NAME:YOUR_TAG \
  .
```

Example:

```bash
docker build \
  --build-arg REACT_APP_WEB3FORMS_ACCESS_KEY=abc123-your-key \
  -t mfifel/portfolio:latest \
  .
```

### 3. Test locally

```bash
docker run --rm -p 8080:80 YOUR_DOCKERHUB_USERNAME/YOUR_IMAGE_NAME:YOUR_TAG
```

Open [http://localhost:8080](http://localhost:8080) and verify all pages and the contact form.

Stop the container with `Ctrl+C`.

---

## Part 3 — Push the image to Docker Hub

### 1. Log in to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password (or access token).

### 2. Push the image

```bash
docker push YOUR_DOCKERHUB_USERNAME/YOUR_IMAGE_NAME:YOUR_TAG
```

Example:

```bash
docker push mfifel/portfolio:latest
```

### 3. Make the repository public (recommended for OCI)

1. Go to [hub.docker.com](https://hub.docker.com/)
2. Open your repository (`YOUR_DOCKERHUB_USERNAME/YOUR_IMAGE_NAME`)
3. **Settings** → set visibility to **Public**

> If you keep the repo **private**, you must configure registry credentials in OCI when creating the container instance (see Part 5, step 4).

---

## Part 4 — Prepare Oracle Cloud networking

You need a Virtual Cloud Network (VCN) with a subnet that can reach the internet.

### Option A — Use the default VCN (quickest)

Many tenancies already have a default VCN. In the OCI Console:

1. **Networking** → **Virtual cloud networks**
2. Note your VCN name and a **public subnet** in your region

### Option B — Create a new VCN with the wizard

1. **Networking** → **Virtual cloud networks** → **Start VCN Wizard**
2. Choose **VCN with Internet Connectivity**
3. Follow the wizard (accept defaults or customize)
4. Note the **VCN** and **public subnet** created

### Security list — allow HTTP traffic

1. Open your VCN → **Security Lists** → default security list
2. **Add Ingress Rules**:

   | Field | Value |
   |-------|-------|
   | Source CIDR | `0.0.0.0/0` |
   | IP Protocol | TCP |
   | Destination Port Range | `80` |
   | Description | Allow HTTP to portfolio |

3. Save

---

## Part 4.5 — You created your VCN: what to do inside it

When you open your VCN, you see tabs like **Details**, **IP administration**, **Subnets**, **Gateways**, **Routing**, **Security**, etc.

**You do NOT need to configure everything.** Here is what matters:

| Tab | Do you need it? | What to do |
|-----|-----------------|------------|
| **Details** | Just read | Note your VCN name — you will select it later in Container Instances |
| **Subnets** | Yes — check | Find the **public** subnet (name often contains `public`). Note its name. You will select it when creating the Container Instance |
| **Security** | Yes — action | Click **Security Lists** → open the **Default Security List** → add ingress rule for port **80** (see above) |
| **Gateways** | Usually no | If you used the VCN wizard with internet connectivity, Internet Gateway is already there |
| **Routing** | Usually no | Route table is already set by the wizard |
| **IP administration**, **VLANs**, **Tags** | No | Skip for now |

### How to open the security list (Step C)

1. OCI Console → **Networking** → **Virtual cloud networks**
2. Click your VCN name
3. Left menu or tabs → **Security** → **Security Lists**
4. Click **Default Security List for …**
5. **Add Ingress Rules** → fill in port `80` as in the table above → **Add Ingress Rules**

### How to find your public subnet

1. Same VCN page → **Subnets**
2. Look for a subnet whose name includes **public** (e.g. `public subnet-vcn-...`)
3. In the row, **Public subnet** should be **Yes**

Write down:
- VCN name: `________________`
- Public subnet name: `________________`

You will use these in Part 5.

---

## Part 5 — Deploy on OCI Container Instances

Container Instances is the simplest way to run a single Docker image on OCI without managing a full VM or Kubernetes cluster.

### 1. Open Container Instances

1. OCI Console → **Developer Services** → **Containers & Artifacts** → **Container Instances**
2. Click **Create container instance**

### 2. Basic information

| Field | Value |
|-------|-------|
| Name | `portfolio` (or any name) |
| Compartment | Your compartment |
| Availability domain | Any available AD |
| Shape | `CI.Standard.E4.Flex` (or default) |
| OCPUs | `1` |
| Memory (GB) | `2` |

### 3. Networking

| Field | Value |
|-------|-------|
| VCN | Your VCN |
| Subnet | **Public subnet** |
| Assign a public IPv4 address | **Yes** |

### 4. Container configuration — connect Docker Hub

This is where Oracle downloads your image from Docker Hub.

1. In the **Containers** section, click **Select image**
2. Choose **Other registries**
3. Choose **Docker Hub**

| Field | Value |
|-------|-------|
| Image URL | `docker.io/YOUR_DOCKERHUB_USERNAME/YOUR_IMAGE_NAME:YOUR_TAG` |
| Container name | `portfolio` |
| Container port | `80` |

Example: if your Docker Hub username is `moufifel` and you pushed `portfolio:latest`:

```
docker.io/moufifel/portfolio:latest
```

**Before this step**, you must have already run on your PC:

```bash
docker build --build-arg REACT_APP_WEB3FORMS_ACCESS_KEY=YOUR_KEY -t moufifel/portfolio:latest .
docker login
docker push moufifel/portfolio:latest
```

And on [hub.docker.com](https://hub.docker.com/), your repo `moufifel/portfolio` should show the image (set to **Public** unless you add credentials below).

**Private Docker Hub repo:** enable **Private registry**, then add:

- Registry host: `docker.io`
- Username: your Docker Hub username
- Password: Docker Hub access token (create one at Docker Hub → Account Settings → Security)

### 5. Start options

Leave defaults unless you need a specific restart policy.

### 6. Create

Click **Create**. Wait until the instance state is **Active** (a few minutes).

### 7. Access your site

1. Open the container instance details
2. Copy the **Public IP address**
3. Visit `http://PUBLIC_IP` in your browser

---

## Part 6 — Optional improvements

### Custom domain

1. Point your domain’s **A record** to the container instance public IP
2. Use [OCI Load Balancer](https://docs.oracle.com/en-us/iaas/Content/Balance/Concepts/balanceoverview.htm) or [API Gateway](https://docs.oracle.com/en-us/iaas/Content/APIGateway/Concepts/apigatewayoverview.htm) for HTTPS with a certificate

### HTTPS with Load Balancer

1. Create a Load Balancer in a public subnet
2. Add a backend set pointing to the container instance IP on port 80
3. Add an HTTPS listener with an OCI-managed or imported TLS certificate
4. Update DNS to the load balancer hostname

### CI/CD from GitHub

Automate build and push on every push to `main`:

1. Docker Hub → **Account Settings** → **Security** → create an **Access Token**
2. GitHub repo → **Settings** → **Secrets** → add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`
3. Add a GitHub Actions workflow (example below)

Example `.github/workflows/docker-publish.yml`:

```yaml
name: Build and push Docker image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: YOUR_DOCKERHUB_USERNAME/YOUR_IMAGE_NAME:latest
          build-args: |
            REACT_APP_WEB3FORMS_ACCESS_KEY=${{ secrets.REACT_APP_WEB3FORMS_ACCESS_KEY }}
```

Add `REACT_APP_WEB3FORMS_ACCESS_KEY` as a GitHub secret. After pushing a new image, restart or recreate the OCI container instance to pull the latest tag (or use a unique tag per release).

---

## Part 7 — Update the deployed app

When you change the code:

```bash
# 1. Rebuild
docker build \
  --build-arg REACT_APP_WEB3FORMS_ACCESS_KEY=YOUR_WEB3FORMS_KEY \
  -t YOUR_DOCKERHUB_USERNAME/YOUR_IMAGE_NAME:YOUR_TAG \
  .

# 2. Push
docker push YOUR_DOCKERHUB_USERNAME/YOUR_IMAGE_NAME:YOUR_TAG

# 3. On OCI: stop and start the container instance, or create a new instance
#    Container Instances → your instance → Stop → Start
```

For production, prefer versioned tags (`v1.0.1`) instead of only `latest`.

---

## Troubleshooting

| Problem | What to check |
|---------|----------------|
| Contact form does not work | Rebuild with `--build-arg REACT_APP_WEB3FORMS_ACCESS_KEY=...` |
| 404 on `/about`, `/portfolio`, etc. | Nginx SPA config — ensure `nginx.conf` is copied in the Dockerfile |
| Cannot reach site from browser | Security list allows TCP port 80; instance has a public IP; subnet is public |
| OCI cannot pull image | Image is public, or private registry credentials are set in OCI |
| Old version still showing | Push a new tag and restart the container instance |

---

## Quick reference — full command sequence

```bash
# Build
docker build --build-arg REACT_APP_WEB3FORMS_ACCESS_KEY=YOUR_KEY -t YOUR_DOCKERHUB_USERNAME/portfolio:latest .

# Test
docker run --rm -p 8080:80 YOUR_DOCKERHUB_USERNAME/portfolio:latest

# Push
docker login
docker push YOUR_DOCKERHUB_USERNAME/portfolio:latest
```

Then deploy in OCI Console with image `docker.io/YOUR_DOCKERHUB_USERNAME/portfolio:latest`, container port **80**, and a **public IP**.
