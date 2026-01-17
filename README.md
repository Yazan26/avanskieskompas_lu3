# 🎓 Avans Kies Kompas - Frontend

> **Een AI-aangedreven module aanbevelingssysteem voor Avans Hogeschool studenten**

Dit is de **Next.js frontend** applicatie voor het Avans Kies Kompas project - een slim aanbevelingsplatform dat studenten helpt bij het vinden van de perfecte keuzemodules op basis van hun interesses, voorkeuren en leerdoelen.

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)

---

## 📚 Inhoudsopgave

- [Overzicht](#-overzicht)
- [Architectuur](#️-architectuur)
- [Gerelateerde Repositories](#-gerelateerde-repositories)
- [Vereisten](#-vereisten)
- [Snelle Start](#-snelle-start)
- [Omgevingsvariabelen](#️-omgevingsvariabelen)
- [Volledige Stack Lokaal Draaien](#-volledige-stack-lokaal-draaien)
- [Beschikbare Scripts](#-beschikbare-scripts)
- [Projectstructuur](#-projectstructuur)
- [Functionaliteiten](#-functionaliteiten)
- [Bijdragen](#-bijdragen)

---

## 🌟 Overzicht

Avans Kies Kompas is een uitgebreide studententool die AI gebruikt om keuzemodules aan te bevelen. Het systeem bestaat uit drie verbonden applicaties:

| Applicatie | Technologie | Doel |
|------------|-------------|------|
| **Frontend** (deze repo) | Next.js + TypeScript | Gebruikersinterface & ervaring |
| **Backend API** | Express.js + TypeScript | Authenticatie, gebruikersdata, modulebeheer |
| **AI Aanbeveler** | FastAPI + Python | Machine learning aanbevelingsengine |

---

## 🏗️ Architectuur

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (Next.js - Poort 3000)                       │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Modules    │  │  Aanbeveling │  │   Profiel / Login      │  │
│  │  Bladeren   │  │   Wizard     │  │   Beheer               │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS BACKEND                          │
│                        (Poort 3001)                              │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │    Auth     │  │   Modules    │  │   Gebruikersvoorkeuren │  │
│  │   Routes    │  │    API       │  │   & Geschiedenis       │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
│                          │                                       │
│                          ▼                                       │
│                    ┌──────────┐                                  │
│                    │ MongoDB  │                                  │
│                    └──────────┘                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FASTAPI AI SERVICE                           │
│                        (Poort 8000)                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              AI Aanbevelingsengine                           ││
│  │   • Content-gebaseerde filtering                             ││
│  │   • Tag matching & analyse                                   ││
│  │   • Gepersonaliseerde scoring                                ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Gerelateerde Repositories

Dit project bestaat uit drie repositories die samenwerken:

| Repository | Beschrijving | Link |
|------------|--------------|------|
| **Frontend** | Next.js TypeScript frontend (deze repo) | Je bent hier! |
| **Backend API** | Express.js TypeScript REST API | [backendLU3](https://github.com/Rishyansyal/backendLU3) |
| **AI Aanbeveler** | FastAPI Python ML service | [fastapiLU3](https://github.com/Rishyansyal/fastapiLU3) |

---

## 📋 Vereisten

Voordat je begint, zorg ervoor dat je de volgende software hebt geïnstalleerd:

### Benodigde Software

| Software | Versie | Download |
|----------|--------|----------|
| **Node.js** | v18+ (LTS aanbevolen) | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ (komt met Node.js) | - |
| **Python** | v3.9+ | [python.org](https://www.python.org/downloads/) |
| **Git** | Nieuwste | [git-scm.com](https://git-scm.com/) |
| **MongoDB** | v6+ (lokaal of Atlas) | [mongodb.com](https://www.mongodb.com/try/download/community) |

### Aanbevolen Tools

- **VS Code** met extensies: ESLint, Prettier, Tailwind CSS IntelliSense
- **MongoDB Compass** voor databasebeheer
- **Postman** of **Insomnia** voor API testen

---

## 🚀 Snelle Start

### Alleen Frontend (Deze Repository)

```bash
# 1. Clone de repository
git clone https://github.com/YOUR_USERNAME/avanskieskompas_lu3.git
cd avanskieskompas_lu3

# 2. Installeer dependencies
npm install

# 3. Configureer omgevingsvariabelen
cp .env.example .env.local
# Bewerk .env.local met jouw configuratie

# 4. Start de development server
npm run dev
```

De frontend is beschikbaar op **http://localhost:3000**

> ⚠️ **Let op**: De frontend heeft de backend services nodig voor volledige functionaliteit.

---

## ⚙️ Omgevingsvariabelen

Maak een `.env.local` bestand in de root directory:

```env
# Backend API URL (Express.js server)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Omgevingsvariabelen Referentie

| Variabele | Beschrijving | Standaard |
|-----------|--------------|-----------|
| `NEXT_PUBLIC_API_URL` | URL van de Express.js backend API | `http://localhost:3001` |

---

## 🔧 Volledige Stack Lokaal Draaien

Om de complete applicatie te draaien, moet je alle drie de services opzetten en starten. Volg deze stappen in volgorde:

### Stap 1: Clone Alle Repositories

```bash
# Maak een projectmap
mkdir avans-kieskompas && cd avans-kieskompas

# Clone alle drie repositories
git clone https://github.com/YOUR_USERNAME/avanskieskompas_lu3.git frontend
git clone https://github.com/Rishyansyal/backendLU3.git backend
git clone https://github.com/Rishyansyal/fastapiLU3.git fastapi
```

Je mappenstructuur zou er zo uit moeten zien:
```
avans-kieskompas/
├── frontend/       # Next.js frontend (deze repo)
├── backend/        # Express.js backend
└── fastapi/        # FastAPI AI service
```

---

### Stap 2: MongoDB Opzetten

**Optie A: Lokale MongoDB**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Of op macOS/Linux
mongod --dbpath /pad/naar/jouw/data
```

**Optie B: MongoDB Atlas (Cloud)**
1. Maak een gratis account aan op [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Maak een nieuwe cluster aan
3. Kopieer je connection string

---

### Stap 3: Express.js Backend Opzetten & Starten

```bash
# Navigeer naar de backend map
cd backend

# Installeer dependencies
npm install

# Maak een omgevingsbestand
# Maak een .env bestand met de volgende variabelen:
```

**Backend `.env` bestand:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/avans-kieskompas
JWT_SECRET=jouw-super-geheime-jwt-sleutel-verander-in-productie
FASTAPI_URL=http://localhost:8000
```

```bash
# Start de backend server
npm run dev
```

✅ De backend draait nu op **http://localhost:3001**

---

### Stap 4: FastAPI AI Service Opzetten & Starten

```bash
# Navigeer naar de FastAPI map
cd ../fastapi

# Maak een virtuele omgeving (aanbevolen)
python -m venv venv

# Activeer de virtuele omgeving
# Op Windows:
venv\Scripts\activate
# Op macOS/Linux:
source venv/bin/activate

# Installeer dependencies
pip install -r requirements.txt

# Start de FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ De AI service draait nu op **http://localhost:8000**
- API documentatie beschikbaar op **http://localhost:8000/docs**

---

### Stap 5: Frontend Opzetten & Starten

```bash
# Navigeer naar de frontend map
cd ../frontend

# Installeer dependencies
npm install

# Maak omgevingsbestand
cp .env.example .env.local

# Start de development server
npm run dev
```

✅ De frontend draait nu op **http://localhost:3000**

---

### 📊 Service Overzicht

Als alle services draaien, heb je:

| Service | URL | Status Check |
|---------|-----|--------------|
| **Frontend** | http://localhost:3000 | Open in browser |
| **Backend API** | http://localhost:3001 | `GET /api/health` |
| **FastAPI AI** | http://localhost:8000 | `GET /docs` |
| **MongoDB** | localhost:27017 | MongoDB Compass |

---

## 📜 Beschikbare Scripts

| Commando | Beschrijving |
|----------|--------------|
| `npm run dev` | Start development server met hot reload |
| `npm run build` | Bouw voor productie |
| `npm start` | Start productie server |
| `npm run lint` | Voer ESLint uit voor code kwaliteit |
| `npm test` | Voer tests uit |
| `npm run test:watch` | Voer tests uit in watch mode |

---

## 📁 Projectstructuur

```
avanskieskompas_lu3/
├── public/                 # Statische bestanden
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── app/               # Next.js App Router pagina's
│   │   ├── browse/        # Module browse pagina's
│   │   ├── faq/           # FAQ sectie
│   │   ├── login/         # Authenticatie pagina's
│   │   ├── profile/       # Gebruikersprofiel
│   │   ├── recommendations/ # AI aanbevelingswizard
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Homepage
│   │   └── globals.css    # Globale stijlen
│   ├── components/        # Herbruikbare UI componenten
│   │   ├── browse/        # Browse-gerelateerde componenten
│   │   ├── common/        # Gedeelde componenten
│   │   ├── layout/        # Layout componenten
│   │   └── recommendations/ # Aanbevelingswizard componenten
│   ├── services/          # API service lagen
│   │   ├── api.ts         # Basis API configuratie
│   │   └── ...
│   ├── types/             # TypeScript type definities
│   └── data/              # Statische data bestanden
├── tests/                 # Test bestanden
├── .env.example           # Omgevingstemplate
├── package.json           # Dependencies & scripts
├── tailwind.config.ts     # Tailwind CSS configuratie
├── tsconfig.json          # TypeScript configuratie
└── README.md              # Dit bestand
```

---

## ✨ Functionaliteiten

### 🎯 Voor Studenten
- **AI-Aangedreven Aanbevelingen**: Krijg gepersonaliseerde module suggesties op basis van jouw interesses
- **Module Browser**: Verken alle beschikbare keuzemodules met geavanceerde filtering
- **Voorkeurenwizard**: Interactieve wizard om jouw leervoorkeuren vast te leggen
- **Favorieten Opslaan**: Sla modules op in je profiel om later te bekijken

### 🔐 Authenticatie
- **Registratie & Inloggen**: Veilig accountbeheer
- **Profielbeheer**: Voorkeuren bijwerken en aanbevelingsgeschiedenis bekijken

### 🎨 Gebruikerservaring
- **Responsief Design**: Werkt op desktop, tablet en mobiel
- **Moderne UI**: Gebouwd met Tailwind CSS en Framer Motion animaties
- **Snel & Geoptimaliseerd**: Next.js 16+ met React 19 features

---

## 🤝 Bijdragen

1. Fork de repository
2. Maak een feature branch (`git checkout -b feature/geweldige-feature`)
3. Commit je wijzigingen (`git commit -m 'Voeg geweldige feature toe'`)
4. Push naar de branch (`git push origin feature/geweldige-feature`)
5. Open een Pull Request

---

## 📞 Hulp Nodig?

Als je problemen tegenkomt of vragen hebt:

1. Bekijk de [FAQ pagina](http://localhost:3000/faq) in de applicatie
2. Open een issue in de betreffende repository
3. Neem contact op met het ontwikkelteam

---

## 📄 Licentie

Dit project is ontwikkeld voor educatieve doeleinden als onderdeel van de Avans Hogeschool LU3 course.

---

<div align="center">

**Gebouwd met ❤️ voor Avans Hogeschool studenten**

[Frontend](https://github.com/YOUR_USERNAME/avanskieskompas_lu3) • [Backend](https://github.com/Rishyansyal/backendLU3) • [AI Service](https://github.com/Rishyansyal/fastapiLU3)

</div>
