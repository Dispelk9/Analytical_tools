# ACT v2.0 (Analytical Chemistry Toolkit)

## Overview

**ACT v2.0** is a modular, web-based toolkit built for professionals working in **analytical chemistry, DevOps, and infrastructure operations**.  
The platform combines **scientific calculation tools**, **automation utilities**, and **operational diagnostics** in a single authenticated dashboard.

ACT is designed as a secure, extensible playground to demonstrate real-world usage of modern frontend, backend, and infrastructure technologies.

---

## Core Features

### 🧪 Analytical Chemistry Tools
- **Adduct Calculator** – Molecular adduct calculation utilities
- **Compound Tools** – Chemical compound-related calculations
- **ACT Math** – Mathematical and equation-based tools for analytical workflows

### 🤖 AI & Automation
- **D9bot** – AI/LLM-based assistant (Gemini-powered) for experimentation and automation

### 📧 Mail & Network Diagnostics
- **SMTP Check** – SMTP / SMTPS / STARTTLS validation (ports 25, 465, 587)
- **Certcheck** – Certificate fetching and validation for SMTP servers
- **Mailing** – Mail infrastructure dashboard (Postfix / Dovecot / Mailcow)

### 📊 Monitoring & Infrastructure
- **Checkmk** – Infrastructure and service monitoring
- **Cloudflare** – DNS routing and traffic analytics
- **HCP Terraform** – Remote Terraform state and workspace management

---

## Architecture & Design

### Authentication & Routing
- Secure session-based authentication (`/api/check-auth`)
- Protected routes using React Router
- Login page isolated from authenticated application layout
- Full-page loading placeholder during authentication and route transitions

### UI & UX
- **Porsche Design System** for consistent enterprise-grade UI
- Responsive tile-based dashboard layout
- Smooth loading experience using a reusable full-page spinner
- Dark-themed layout to reduce visual strain and avoid white flashes

---

## Technology Stack

### Frontend
- **React + TypeScript**
- **Vite**
- **React Router v6**
- **TanStack Query**
- **Porsche Design System**

### Backend
- **Python (Flask)**
- **Go**
- **JavaScript**
- **PostgreSQL**

### Infrastructure & DevOps
- Docker-based services
- CI/CD-ready architecture
- Reverse proxy & API gateway support
- Cloudflare & Terraform integration

---

## Project Structure (High-Level)

- `App.tsx` – Routing, authentication guard, layout
- `AppLayout` – Dashboard UI and navigation
- `RequireAuth` – Auth gate with loading state
- `FullPageSpinner` – Global loading placeholder
- `/pages/*` – Feature modules (Adduct, Compound, Math, SMTP, AI, etc.)

---

## Special Thanks

### **vh**
- 📧 Email: [viet.hoang@dispelk9.de](mailto:viet.hoang@dispelk9.de)  
- 👤 Role: Developer, Administrator

### **pth**
- 📧 Email: [phamthuhuong.1512@gmail.com](mailto:phamthuhuong.1512@gmail.com)  
- 👤 Role: Initial Ideas, Tester

---

## License & Usage

ACT v2.0 is a private experimental project intended for demonstration, learning, and internal tooling.  
Some linked services require external authentication and permissions.
