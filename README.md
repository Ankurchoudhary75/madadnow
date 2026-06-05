<div align="center">

# 🛡️ MadadNow 

**Next-Generation Disaster Response & Emergency Platform**

*Because every single second counts when the network goes dark.*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)](https://spring.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white)](https://jenkins.io/)

[Live Demo](#) • [Installation](#-installation) • [System Architecture](#-system-architecture) • [Features](#-core-features)

</div>

---

> **MadadNow** is a full-stack, AI-powered emergency management system designed to bridge the gap between victims, volunteers, and the State Emergency Response Support System (ERSS 112). Built with a resilient offline-first architecture, it ensures that users are never truly disconnected during a crisis.

---

## ⚡ Core Features

| Feature | Description |
| :--- | :--- |
| 📡 **Offline-First Queueing** | Triggers SOS payloads completely offline. App dynamically caches local shelters and intelligently flushes the SOS queue the exact millisecond network connectivity restores. |
| 🤖 **AI Sentinel Mode** | Utilizes mobile hardware (Accelerometer & Microphone) to detect **>3 G-Force impacts** or audio distress cues ("Help!"), automatically firing SOS sequences if the victim is incapacitated. |
| 🗺️ **Live Infrastructure Map** | Integrates dynamically with **OpenStreetMap / Photon APIs** to pinpoint the absolute nearest Government Hospitals, Police Stations, and NGOs within a 25km radius. |
| 🛡️ **ERSS 112 Command** | Panic-proof UI explicitly designed for integration into State Emergency Control Rooms, featuring countdown validations and rapid-action workflows. |

<br/>

## 🏗 System Architecture

MadadNow is engineered as a robust, containerized microservice application capable of handling high-throughput disaster events.

```mermaid
graph TD
    Client([📱 User Device]) -->|HTTPS Proxy| Nginx[Vercel / Nginx Frontend]
    
    subgraph Cloud Backend
        Nginx -->|REST / JSON| Spring[☕ Spring Boot Application]
        Spring -->|Live GPS Query| OSM[🗺️ OpenStreetMap API]
        Spring <-->|JWT / Spring Security| Auth[Security Layer]
    end

    subgraph Persistence Layer
        Spring -->|JDBC| DB[(🐘 PostgreSQL)]
        Spring -->|Lettuce SSL| Cache[(⚡ Redis Cache)]
    end
    
    style Client fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Spring fill:#166534,stroke:#4ade80,stroke-width:2px,color:#fff
    style Nginx fill:#0f172a,stroke:#e2e8f0,color:#fff
    style DB fill:#1e3a8a,stroke:#60a5fa,color:#fff
    style Cache fill:#7f1d1d,stroke:#f87171,color:#fff
    style OSM fill:#475569,stroke:#cbd5e1,color:#fff
```

<details>
<summary><b>Click to view Tech Stack Breakdown</b></summary>

### Frontend Engineering
- **React.js 19 (Vite):** Ultra-fast compilation and state management.
- **Tailwind CSS:** Modern Glassmorphism and responsive dark-mode styling.
- **Leaflet.js:** Advanced geospatial rendering and interactive mapping.

### Backend Engineering
- **Java 17 & Spring Boot 3:** High-performance, multi-threaded REST APIs.
- **Spring Data JPA & Hibernate:** ORM mapping for complex relational emergency data.
- **Spring Security:** Stateless JWT-based authentication and rate limiting.

### DevOps & Infrastructure
- **Docker & Docker Compose:** 100% containerized environments for identical Dev/Prod parity.
- **Jenkins CI/CD:** Automated pipeline testing and Docker image builds.
- **Nginx:** Reverse proxying and load balancing for React static assets.
</details>

---

## 💻 Installation

### Option A: Local Containerized Deployment (Recommended)
You can spin up the entire isolated stack (Frontend, Backend, Postgres, Redis) using our Docker orchestration.

```bash
# 1. Clone the repository
git clone https://github.com/YourUsername/madadnow.git
cd madadnow

# 2. Build the multi-stage Docker containers
docker compose up -d --build

# 3. App is instantly live
# Frontend -> http://localhost:5173
# Backend  -> http://localhost:8080/api
```

### Option B: Cloud Serverless Deployment
MadadNow is optimized for serverless deployments on platforms like Render and Vercel. 
Simply inject the following environment variables into your Cloud provider:
* `SPRING_DATASOURCE_URL` (Neon Postgres JDBC String)
* `SPRING_REDIS_URL` (Upstash Rediss Connection)
* *The `frontend/vercel.json` file will automatically handle Nginx-style proxying to your backend.*

---

## 🎨 Application Previews

*(Replace these placeholders with actual screenshots or GIFs of your app)*

> <img src="https://via.placeholder.com/800x400?text=Insert+Dashboard+Screenshot+Here" alt="Dashboard Preview">
> <img src="https://via.placeholder.com/800x400?text=Insert+Live+Map+Screenshot+Here" alt="Map Preview">

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Built with ❤️ for public safety.
