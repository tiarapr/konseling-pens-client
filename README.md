# 🎓 E-Konseling PENS – Frontend Web App

This repository contains the **frontend** application for the **E-Konseling PENS** platform. 

---

## ⚙️ Tech Stack

- ⚛️ **React** – Frontend UI Library  
- ⚡ **Vite** – Lightning-fast build tool  
- 🎨 **Tailwind CSS** – Utility-first CSS framework  

> ⚠️ This project uses UI elements adapted from [TailAdmin]

---

## 🔐 Environment Variables

Create a `.env` file (or rename `.env-example`) in the root directory and configure the following:

```env
VITE_BASIC_AUTH_USERNAME=yourUsername
VITE_BASIC_AUTH_PASSWORD=yourPassword

VITE_API_BASE_URL=https://your-api-domain.com
````

These variables are accessible in your code via `import.meta.env`.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tiarapr/konseling-pens-client
cd konseling-pens-web
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Run the App in Development

```bash
npm run dev
# or
yarn dev
```

The app will be available at:
[http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

---

## 📌 Notes

For the backend and API documentation, see the [E-Konseling PENS Backend Repository](https://github.com/tiarapr/konseling-pens-server).

