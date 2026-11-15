<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:dc2626,100:f97316&height=220&section=header&text=MadadNow&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=Offline-first%20Disaster%20Response%20%26%20Emergency%20SOS%20Platform&descSize=18&descAlignY=60&animation=fadeIn" alt="MadadNow banner" width="100%"/>

<a href="https://github.com/Ankurchoudhary75/madadnow">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1200&color=F97316&center=true&vCenter=true&width=700&lines=Because+every+second+counts+when+the+network+goes+dark.;SOS+that+works+offline.;Distress+detection+when+you+can't+tap.;Nearest+help%2C+mapped+in+real+time." alt="Typing animation" />
</a>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-Open_App-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://madadnow-dyh6.vercel.app/)
[![Stars](https://img.shields.io/github/stars/Ankurchoudhary75/madadnow?style=for-the-badge&logo=github&color=f59e0b)](https://github.com/Ankurchoudhary75/madadnow/stargazers)
[![Forks](https://img.shields.io/github/forks/Ankurchoudhary75/madadnow?style=for-the-badge&logo=github&color=3b82f6)](https://github.com/Ankurchoudhary75/madadnow/network/members)
[![Issues](https://img.shields.io/github/issues/Ankurchoudhary75/madadnow?style=for-the-badge&color=ef4444)](https://github.com/Ankurchoudhary75/madadnow/issues)
[![Last Commit](https://img.shields.io/github/last-commit/Ankurchoudhary75/madadnow?style=for-the-badge&color=8b5cf6)](https://github.com/Ankurchoudhary75/madadnow/commits/main)
[![License](https://img.shields.io/badge/License-MIT-0ea5e9?style=for-the-badge)](#-license)

<br/>

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,js,java,spring,postgres,redis,docker,jenkins,nginx,vercel&perline=12" alt="Tech stack icons" />

<br/><br/>

**[🚀 Live Demo](https://madadnow-dyh6.vercel.app/)** &nbsp;•&nbsp;
**[✨ Features](#-features)** &nbsp;•&nbsp;
**[⚙️ How It Works](#️-how-it-works)** &nbsp;•&nbsp;
**[🏗 Architecture](#-system-architecture)** &nbsp;•&nbsp;
**[📦 Quick Start](#-quick-start)** &nbsp;•&nbsp;
**[☁️ Deploy](#️-cloud-deployment)** &nbsp;•&nbsp;
**[🗺 Roadmap](#-roadmap)**

</div>

---

## 📑 Table of Contents

<details open>
<summary><b>Click to expand / collapse</b></summary>

1. [About the Project](#-about-the-project)
2. [Features](#-features)
3. [How It Works](#️-how-it-works)
4. [System Architecture](#-system-architecture)
5. [Tech Stack](#-tech-stack)
6. [Project Structure](#-project-structure)
7. [Quick Start](#-quick-start)
8. [Cloud Deployment](#️-cloud-deployment)
9. [Design Principles](#-design-principles)
10. [Privacy & Safety](#-privacy--safety)
11. [Troubleshooting](#-troubleshooting)
12. [FAQ](#-faq)
13. [Roadmap](#-roadmap)
14. [Contributing](#-contributing)
15. [License](#-license)
16. [Author](#-author)

</details>

---

## 🎯 About the Project

> **MadadNow** (*madad* = "help" in Hindi/Urdu) is a full-stack, sensor-aware emergency management platform that bridges the gap between **victims**, **volunteers**, and the State Emergency Response Support System (**ERSS 112**).

In a real disaster the usual assumptions break: mobile networks are congested or down, users are injured or panicking, and some victims cannot operate a phone at all. MadadNow is engineered around those failures instead of ignoring them.

<table>
<tr>
<td width="50%" valign="top">

### 😰 The problem
- Networks drop exactly when they are needed most
- Panicking users cannot fill in forms or remember logins
- Injured or unconscious victims cannot tap a button
- People do not know where the nearest help actually is
- Control rooms need fast, clear, actionable alerts

</td>
<td width="50%" valign="top">

### 🛡️ The MadadNow answer
- **Queue the SOS offline**, send it the moment the network returns
- **One-action SOS** with a short countdown to prevent false alarms
- **Sensor-based triggers** for impacts and spoken distress cues
- **Live map** of hospitals, police stations and NGOs near you
- **Command-style UI** built for emergency control rooms

</td>
</tr>
</table>

> [!IMPORTANT]
> MadadNow is a software project and **not an official government service**. In a real emergency, always call **112** (or your local emergency number) directly.

---

## ✨ Features

<div align="center">

| | Feature | What it does |
| :---: | :--- | :--- |
| 📡 | **Offline-First Queueing** | Trigger SOS payloads with **no connectivity**. Nearby shelters are cached on the device, and the queued SOS is **flushed automatically** when the network is restored. |
| 🤖 | **AI Sentinel Mode** | Watches the **accelerometer** and **microphone** for impacts above **3 G** or audio distress cues such as *"Help!"* and starts the SOS sequence if the victim may be incapacitated. |
| 🗺️ | **Live Infrastructure Map** | Uses **OpenStreetMap / Photon APIs** to locate Government Hospitals, Police Stations and NGOs within a **25 km radius**, drawn with **Leaflet.js**. |
| 🚨 | **ERSS 112 Command UI** | Panic-proof interface designed for State Emergency Control Rooms, with **countdown validation** and **rapid-action workflows**. |
| 🔐 | **Secure Backend** | Stateless **JWT** authentication with **Spring Security** and request rate limiting. |
| ⚡ | **Cached Lookups** | **Redis** (Lettuce over TLS) accelerates repeated queries and reduces load on external APIs. |
| 🐳 | **One-Command Setup** | Entire stack (frontend, backend, PostgreSQL, Redis) runs through **Docker Compose**. |
| 🔁 | **CI/CD Ready** | **Jenkins** pipeline for automated testing and Docker image builds. |

</div>

### 🔍 Feature deep dive

<details>
<summary><b>📡 Offline-First Queueing: how SOS survives a dead network</b></summary>
<br/>

1. The user (or Sentinel Mode) raises an SOS and the app builds the payload on the device.
2. If the network is unavailable, the SOS is **stored locally in a queue** instead of failing.
3. Nearby shelters that were cached earlier remain visible, so the user still has guidance.
4. When connectivity returns, the app **detects it and flushes the queue** to the backend.

The goal is simple: **an SOS is never silently lost.**

</details>

<details>
<summary><b>🤖 AI Sentinel Mode: help for people who cannot ask for it</b></summary>
<br/>

| Signal | Sensor | Trigger |
| :--- | :--- | :--- |
| 💥 Hard impact (fall, collision, crash) | Accelerometer | Force greater than **3 G** |
| 🗣️ Spoken distress cue | Microphone | Phrases such as **"Help!"** |

When a signal fires, the app starts the **SOS countdown**. If the user is conscious they can cancel; if not, the SOS goes out automatically (or is queued if offline).

</details>

<details>
<summary><b>🗺️ Live Infrastructure Map: find help fast</b></summary>
<br/>

- Reads the user's live GPS position
- Queries **OpenStreetMap / Photon** for emergency facilities
- Shows **Government Hospitals**, **Police Stations** and **NGOs** within **25 km**
- Renders results on an interactive **Leaflet** map

</details>

<details>
<summary><b>🚨 ERSS 112 Command UI: designed for panic</b></summary>
<br/>

- Large, high-contrast controls that work under stress
- **Countdown validation** to stop accidental dispatch
- **Rapid-action workflows** for quick handling in control-room scenarios

</details>

---

## ⚙️ How It Works

```mermaid
flowchart LR
    A([🆘 SOS Trigger]) --> B{Source?}
    B -->|Manual button| C[⏱ Countdown]
    B -->|Impact > 3G| C
    B -->|Voice: Help!| C
    C -->|User cancels| X([❌ Cancelled])
    C -->|Not cancelled| D{Online?}
    D -->|Yes| E[📤 Send to backend]
    D -->|No| F[📥 Save in offline queue]
    F -->|Network restored| E
    E --> G[(🐘 PostgreSQL)]
    E --> H([🚨 Emergency response])

    style A fill:#dc2626,stroke:#fecaca,color:#fff
    style C fill:#f97316,stroke:#fed7aa,color:#fff
    style E fill:#166534,stroke:#4ade80,color:#fff
    style F fill:#7c3aed,stroke:#ddd6fe,color:#fff
    style G fill:#1e3a8a,stroke:#60a5fa,color:#fff
    style H fill:#dc2626,stroke:#fecaca,color:#fff
```

### 🧭 User journey

| Step | What the user does | What MadadNow does |
| :---: | :--- | :--- |
| **1** | Opens the app (or enables Sentinel Mode) | Gets GPS location and caches nearby shelters |
| **2** | Presses SOS, or an impact / "Help!" is detected | Starts a cancellable countdown |
| **3** | Does nothing, or cancels a false alarm | Sends the SOS, or aborts it |
| **4** | Has no network | Stores the SOS in the offline queue |
| **5** | Network comes back | Flushes the queue to the backend automatically |
| **6** | Looks for help | Shows the nearest hospitals, police stations and NGOs on the map |

---

## 🏗 System Architecture

MadadNow is a containerized full-stack application: a React frontend, a Spring Boot REST API, PostgreSQL for persistence and Redis for caching.

```mermaid
graph TD
    Client([📱 User Device]) -->|HTTPS| Edge[Vercel / Nginx Frontend]

    subgraph Backend [☁️ Cloud Backend]
        Edge -->|REST / JSON| Spring[☕ Spring Boot Application]
        Spring -->|Live GPS Query| OSM[🗺️ OpenStreetMap / Photon]
        Spring <-->|JWT| Auth[🔐 Spring Security]
    end

    subgraph Persistence [💾 Persistence Layer]
        Spring -->|JDBC| DB[(🐘 PostgreSQL)]
        Spring -->|Lettuce SSL| Cache[(⚡ Redis Cache)]
    end

    style Client fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Spring fill:#166534,stroke:#4ade80,stroke-width:2px,color:#fff
    style Edge fill:#0f172a,stroke:#e2e8f0,color:#fff
    style Auth fill:#14532d,stroke:#86efac,color:#fff
    style DB fill:#1e3a8a,stroke:#60a5fa,color:#fff
    style Cache fill:#7f1d1d,stroke:#f87171,color:#fff
    style OSM fill:#475569,stroke:#cbd5e1,color:#fff
```

### 📨 SOS sequence

```mermaid
sequenceDiagram
    autonumber
    actor V as 🧑 Victim
    participant App as 📱 React App
    participant Q as 📥 Offline Queue
    participant API as ☕ Spring Boot API
    participant DB as 🐘 PostgreSQL

    V->>App: Press SOS / Sentinel trigger
    App->>App: Countdown validation
    alt Network available
        App->>API: Send SOS with location
        API->>DB: Store SOS
        API-->>App: Acknowledged
    else Offline
        App->>Q: Store SOS locally
        Note over App,Q: Auto-flush when connectivity restores
        Q->>API: Send queued SOS
        API->>DB: Store SOS
    end
```

---

## 🧰 Tech Stack

<div align="center">

| Layer | Technologies |
| :---: | :--- |
| 🎨 **Frontend** | ![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) ![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white) |
| ⚙️ **Backend** | ![Java](https://img.shields.io/badge/Java_17-ED8B00?logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?logo=springboot&logoColor=white) ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?logo=springsecurity&logoColor=white) ![Hibernate](https://img.shields.io/badge/Hibernate_JPA-59666C?logo=hibernate&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) |
| 💾 **Data** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white) |
| 🌍 **Maps & Geo** | ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?logo=openstreetmap&logoColor=white) ![Photon](https://img.shields.io/badge/Photon_API-3B82F6) |
| 🚢 **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![Jenkins](https://img.shields.io/badge/Jenkins-D24939?logo=jenkins&logoColor=white) ![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white) |
| ☁️ **Hosting** | ![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=black) ![Neon](https://img.shields.io/badge/Neon_Postgres-00E599?logo=neon&logoColor=black) ![Upstash](https://img.shields.io/badge/Upstash_Redis-00E9A3?logo=upstash&logoColor=black) |

</div>

<details>
<summary><b>📚 Why these choices?</b></summary>
<br/>

| Technology | Reason |
| :--- | :--- |
| **React + Vite** | Fast builds and a responsive, component-based UI |
| **Tailwind CSS** | Quick, consistent dark-mode and glassmorphism styling |
| **Leaflet.js** | Lightweight, flexible interactive maps |
| **Spring Boot** | Mature, production-ready REST API framework |
| **Spring Security + JWT** | Stateless, scalable authentication |
| **PostgreSQL** | Reliable relational storage for emergency data |
| **Redis** | Low-latency caching for repeated lookups |
| **Docker Compose** | Identical dev and prod environments in one command |
| **Jenkins** | Automated builds and tests on every change |

</details>

---

## 📁 Project Structure

```text
madadnow/
├── 📂 backend/              # Spring Boot REST API (Java 17)
├── 📂 frontend/             # React + Vite app
│   └── vercel.json          # Proxy rules for Vercel deployment
├── 📂 .vscode/              # Editor settings
├── 🐳 docker-compose.yml    # Frontend + Backend + PostgreSQL + Redis
├── 🔧 Jenkinsfile           # CI/CD pipeline definition
└── 📘 README.md
```

---

## 📦 Quick Start

### ✅ Prerequisites

| Tool | Needed for |
| :--- | :--- |
| [Docker](https://docs.docker.com/get-docker/) + Docker Compose | Running the full stack (recommended) |
| [Git](https://git-scm.com/) | Cloning the repository |

### 🐳 Run everything with Docker

```bash
# 1️⃣ Clone the repository
git clone https://github.com/Ankurchoudhary75/madadnow.git
cd madadnow

# 2️⃣ Build and start all containers (Frontend, Backend, PostgreSQL, Redis)
docker compose up -d --build

# 3️⃣ Open the app 🎉
```

| Service | URL |
| :--- | :--- |
| 🖥️ **Frontend** | http://localhost:5173 |
| ⚙️ **Backend API** | http://localhost:8080/api |

**Handy commands**

```bash
docker compose ps          # check container status
docker compose logs -f     # follow live logs
docker compose down        # stop and remove containers
docker compose up -d --build   # rebuild after code changes
```

> [!TIP]
> Allow **location**, **motion sensor** and **microphone** permissions in your browser to try Sentinel Mode and the live map. Sensor features work best on a real phone over HTTPS.

---

## ☁️ Cloud Deployment

MadadNow is optimized for serverless-style hosting. The live demo runs at **[madadnow-dyh6.vercel.app](https://madadnow-dyh6.vercel.app/)**.

```mermaid
graph LR
    U([👤 Users]) --> V[▲ Vercel<br/>React frontend]
    V -->|vercel.json proxy| R[🟢 Render<br/>Spring Boot API]
    R --> N[(🐘 Neon<br/>PostgreSQL)]
    R --> UP[(⚡ Upstash<br/>Redis)]

    style V fill:#000,stroke:#fff,color:#fff
    style R fill:#065f46,stroke:#34d399,color:#fff
    style N fill:#1e3a8a,stroke:#60a5fa,color:#fff
    style UP fill:#7f1d1d,stroke:#f87171,color:#fff
```

### Backend environment variables

| Variable | Description |
| :--- | :--- |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC connection string (for example from **Neon**) |
| `SPRING_REDIS_URL` | Redis connection string using `rediss://` for TLS (for example from **Upstash**) |

### Deployment steps

1. **Database:** create a PostgreSQL instance and copy its JDBC URL.
2. **Cache:** create a Redis instance and copy its `rediss://` URL.
3. **Backend:** deploy `backend/` to Render and add the variables above.
4. **Frontend:** deploy `frontend/` to Vercel. The `frontend/vercel.json` file proxies API calls to your backend.

> [!WARNING]
> Never commit real database passwords, tokens or secrets. Always use your hosting provider's environment variable settings.

---

## 🧠 Design Principles

| Principle | Meaning |
| :--- | :--- |
| 🔌 **Offline first** | The app must stay useful with no signal |
| 👆 **Fewest possible taps** | Every extra step costs seconds in an emergency |
| ⏱️ **Confirm, don't block** | A short countdown prevents false alarms without slowing real ones |
| 🙌 **Hands-free when needed** | Sensors act when the user cannot |
| 🎨 **Readable under stress** | High contrast, large targets, minimal text |
| 🔒 **Secure by default** | Stateless auth and rate limiting on the API |

---

## 🔒 Privacy & Safety

- 📍 **Location, motion and microphone** access require explicit browser permission.
- ⏱️ Automatic triggers pass through a **countdown** so accidental drops or loud noises do not immediately raise an alert.
- 📱 Sensor and audio support **varies by device and browser**; test on your target phones.
- 🗺️ Facility data comes from **OpenStreetMap** and may be incomplete or out of date.
- 🚫 This project does not replace calling **112**.

---

## 🛠 Troubleshooting

<details>
<summary><b>🐳 Ports 5173 or 8080 are already in use</b></summary>
<br/>

Stop whatever is using the port, or change the port mapping in `docker-compose.yml`, then run `docker compose up -d --build` again.

</details>

<details>
<summary><b>🔄 Containers start but the app does not load</b></summary>
<br/>

Check status and logs:

```bash
docker compose ps
docker compose logs -f
```

The backend may need a few seconds to connect to PostgreSQL and Redis on first start.

</details>

<details>
<summary><b>📍 Map or location is not working</b></summary>
<br/>

Make sure the browser has **location permission** enabled. Geolocation and sensor APIs generally require a secure context (HTTPS or `localhost`).

</details>

<details>
<summary><b>🎤 Sentinel Mode does not react</b></summary>
<br/>

Grant **microphone** and **motion sensor** permissions, and test on a real phone. Desktop browsers usually have no accelerometer.

</details>

<details>
<summary><b>☁️ API calls fail on the deployed frontend</b></summary>
<br/>

Check that `frontend/vercel.json` points to your live backend URL and that `SPRING_DATASOURCE_URL` and `SPRING_REDIS_URL` are set correctly on the backend host. Free-tier backends can take a moment to wake up after being idle.

</details>

---

## ❓ FAQ

<details>
<summary><b>Is MadadNow an official emergency service?</b></summary>
<br/>

No. It is a software project designed around the ERSS 112 model. Always call 112 in a real emergency.

</details>

<details>
<summary><b>Does Sentinel Mode send alerts instantly?</b></summary>
<br/>

It starts a **cancellable countdown** first so that false alarms can be stopped.

</details>

<details>
<summary><b>What happens to an SOS sent without internet?</b></summary>
<br/>

It is stored in a local queue and sent automatically when connectivity returns.

</details>

<details>
<summary><b>What kinds of places does the map show?</b></summary>
<br/>

Government hospitals, police stations and NGOs within a 25 km radius of your location.

</details>

---

## 🗺 Roadmap

```mermaid
timeline
    title MadadNow Roadmap
    section ✅ Delivered
        Core : Offline SOS queue
             : AI Sentinel Mode
             : Live infrastructure map
        Platform : Docker Compose stack
                 : Jenkins CI/CD
                 : Vercel deployment
    section 🔜 Planned
        Reliability : Installable PWA with background sync
                    : SMS fallback
        Community : Volunteer matching
                  : Live responder tracking
        Reach : Multi-language support
              : Official ERSS 112 integration
```

- [x] Offline-first SOS queue with auto-flush
- [x] AI Sentinel Mode (impact and audio distress detection)
- [x] Live infrastructure map (25 km radius)
- [x] Dockerized stack with Jenkins CI/CD
- [x] Cloud deployment on Vercel
- [ ] Installable PWA with background sync
- [ ] SMS fallback when mobile data is unavailable
- [ ] Volunteer matching and live responder tracking
- [ ] Multi-language support (Hindi, Punjabi and more)
- [ ] Official ERSS 112 integration

---

## 🤝 Contributing

Contributions make open source great. Any help is **appreciated**!

```bash
# 1. Fork the project, then clone your fork
git clone https://github.com/<your-username>/madadnow.git

# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request 🎉
```

For major changes, please [open an issue](https://github.com/Ankurchoudhary75/madadnow/issues) first to discuss what you would like to change.

---

## 📝 License

Distributed under the **MIT License**. See the [LICENSE](https://github.com/Ankurchoudhary75/madadnow/blob/main/LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

<a href="https://github.com/Ankurchoudhary75">
  <img src="https://github.com/Ankurchoudhary75.png" width="110" alt="Ankur Choudhary" style="border-radius:50%"/>
</a>

### **Ankur Choudhary**

[![GitHub](https://img.shields.io/badge/GitHub-Ankurchoudhary75-181717?style=for-the-badge&logo=github)](https://github.com/Ankurchoudhary75)

<br/>

**If MadadNow inspires you, please consider giving it a ⭐**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:f97316,50:dc2626,100:0f172a&height=120&section=footer" alt="footer" width="100%"/>

*Built with ❤️ for public safety.*

</div>
