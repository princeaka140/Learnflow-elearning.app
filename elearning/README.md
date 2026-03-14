# eLearning Platform

A modern eLearning web application built with **React 19**, **Vite**, **shadcn/ui**, and **Tailwind CSS v4**.

---

## Prerequisites

Make sure the following are installed on your machine before getting started:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes bundled with Node.js)

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd elearning
```

### 2. Install all dependencies

```bash
npm install
```

This will install all modules listed in `package.json`, including:

| Category | Packages |
|---|---|
| UI Framework | `react`, `react-dom`, `react-router-dom` |
| Styling | `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css` |
| Components | `shadcn`, `@base-ui/react`, `lucide-react` |
| Data / State | `zustand`, `recharts` |
| Utilities | `clsx`, `tailwind-merge`, `class-variance-authority`, `sonner`, `next-themes` |
| Build Tools | `vite`, `@vitejs/plugin-react`, `vite-plugin-svgr` |

---

## Running the App

### Development server

```bash
npm run dev
```


### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
elearning/
  public/               # Static assets
  src/
    assets/             # Images and SVGs
    components/         # Reusable UI components
      layout/           # Navbar and layout wrappers
      ui/               # shadcn UI primitives
      video/            # Video player component
    data/               # Mock data
    hooks/              # Custom React hooks
    lib/                # Utility functions
    pages/              # Route-level page components
    store/              # Zustand global store
    App.jsx
    index.css
    main.jsx
  index.html
  vite.config.js
  package.json
```


## To note

I used mock datas in elearning\src\data\mockData.js.
you can change it to use backend live server.

# for courses

In elearning\src\components\, you can configure it to also use backend server


I used mock datas. when backend server is ready, you can switch
