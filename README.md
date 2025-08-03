# Text2Poster Monorepo

This is a monorepo project for Text2Poster, which includes a frontend application and a backend server.

## Tech Stack

- **Monorepo:** Managed with npm workspaces.
- **Frontend:**
  - React
  - Vite
  - Ant Design
  - TypeScript
- **Backend:**
  - Node.js
  - Express
  - TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wp931120/aiposter.git
   cd aiposter
   ```

2. Install dependencies for both frontend and backend from the root directory:
   ```bash
   npm run install:frontend
   npm run install:backend
   ```

### Running the Application

You can run the frontend and backend servers concurrently from the root directory.

- To start the frontend development server:
  ```bash
  npm run dev:frontend
  ```
  The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).

- To start the backend server:
  ```bash
  npm run dev:backend
  ```
  The backend server will be running on `http://localhost:3000`.