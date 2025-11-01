# 🎓 Eduverse

Eduverse is a modern e-learning platform built with **Angular** and **Tailwind CSS**.  
It provides a seamless interface for learners to browse, purchase, and manage online courses — including authentication, cart management, and personalized dashboards.

---

## 🚀 Features

- 🔐 **Authentication**
  - Local sign-in / sign-up
  - Google OAuth integration (via `angular-oauth2-oidc`)
- 🧭 **User Dashboard**
  - View and edit profile
  - Track purchased courses
  - Manage cart and “watch later” list
- 🛒 **Course Management**
  - Browse available courses
  - Add to cart / purchase flow
- 🎨 **Modern UI**
  - Responsive layout using Tailwind CSS
  - Component-based structure following Angular best practices

---

## 🧰 Tech Stack

| Layer              | Technology             |
| ------------------ | ---------------------- |
| Frontend Framework | Angular v20            |
| Styling            | Tailwind CSS           |
| State Management   | RxJS + BehaviorSubject |
| Auth               | OAuth2 / JWT           |
| Language           | TypeScript             |
| HTTP Client        | Angular HttpClient     |

---

## 🗂️ Project Structure

```
Eduverse/
├── src/
│ ├── app/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ │ └── user-auth.service.ts
│ │ ├── interfaces/
│ │ └── app.module.ts
│ ├── assets/
│ ├── environments/
│ └── main.ts
├── angular.json
├── tailwind.config.js
├── package.json
└── README.md

```

---

## ⚙️ Getting Started

### 1. Prerequisites

Make sure you have:

- Node.js (v18+ recommended)
- npm or yarn
- Angular CLI installed globally
  ```bash
  npm install -g @angular/cli
  ```

### 2. Installation

```bash
   git clone https://github.com/Amrsamy19/Eduverse.git
   cd Eduverse
   npm install
```

3. Run Development Server

```bash
ng serve
```

Link for Backend Server: https://github.com/Marwan-Mamdouh/eduverse-backend/
