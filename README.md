# Portfolio — Mouad Fifel

Personal portfolio website for **Mouad Fifel**, DevOps Engineer based in Agadir, Morocco.

The site showcases professional background, projects, and a contact form. It is built as a single-page application (SPA) with client-side routing.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 (Create React App) |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Contact form | [Web3Forms](https://web3forms.com/) |
| Styling | CSS + Bootstrap Grid |
| Production server | Nginx (via Docker) |

## Features

- **Landing** — Animated hero section with typewriter effect
- **About** — Bio, skills, and downloadable CV
- **Portfolio** — Project showcase with modal details
- **Contact** — Form powered by Web3Forms

## Project structure

```
Portfolio/
├── public/              # Static assets and index.html
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route pages (landing, about, portfolio, contact)
│   ├── assets/          # CV and other files
│   └── images/          # Images
├── Dockerfile           # Multi-stage build (Node + Nginx)
├── nginx.conf           # Nginx config for SPA routing
└── README-STEPS.md      # Docker Hub & Oracle Cloud deployment guide
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (local development)
- [Docker](https://www.docker.com/) (container build & deployment)
- A [Web3Forms](https://web3forms.com/) access key for the contact form

## Local development

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/Portfolio.git
   cd Portfolio
   ```

2. Copy the environment template and add your Web3Forms key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   REACT_APP_WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```

3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm start
   ```

   The app runs at [http://localhost:3000](http://localhost:3000).

## Production build (without Docker)

```bash
npm run build
```

The optimized static files are output to the `build/` folder.

## Docker

Build and run locally:

```bash
docker build --build-arg REACT_APP_WEB3FORMS_ACCESS_KEY=your_key -t my-portfolio .
docker run -p 8080:80 my-portfolio
```

Open [http://localhost:8080](http://localhost:8080).

For full steps to push to Docker Hub and deploy on **Oracle Cloud Infrastructure (OCI)**, see [README-STEPS.md](./README-STEPS.md).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_WEB3FORMS_ACCESS_KEY` | Yes (for contact form) | API key from Web3Forms. Baked in at **build time** (CRA). |

## License

See [LICENSE.md](./LICENSE.md).

## Author

**Mouad Fifel** — [mouad.fifel.contact@gmail.com](mailto:mouad.fifel.contact@gmail.com)
