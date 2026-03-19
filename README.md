# Veda AI - Intelligent Assessment Creator

A production-grade, full-stack AI-powered assessment creation platform. Teachers can create assignments and generate structured question papers using AI, with real-time updates and PDF export.

## 🏗️ Architecture

```
Frontend (Next.js) → Express API → BullMQ Queue → Worker → MongoDB → WebSocket → Frontend
```

### Key Principles:
- **Non-blocking API**: AI generation happens in a background worker
- **Real-time updates**: WebSocket notifications when generation completes
- **Structured output**: All AI responses are validated JSON
- **Caching**: Redis caches completed results for fast retrieval
- **Retry logic**: Failed AI generations are retried up to 3 times

## 📁 Project Structure

```
veda-ai/
├── frontend/          # Next.js 14 (App Router) + TypeScript + Tailwind + Shadcn UI
│   ├── src/
│   │   ├── app/           # Pages (home, create, assignment/[id])
│   │   ├── components/    # Reusable UI components (Shadcn)
│   │   ├── hooks/         # Custom hooks (useSocket)
│   │   ├── lib/           # API client, utilities
│   │   └── store/         # Zustand state management
│   └── ...
├── backend/           # Express + TypeScript + MongoDB + BullMQ + Socket.io
│   ├── src/
│   │   ├── config/        # Redis, BullMQ queue setup
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   └── socket/        # WebSocket handlers
│   └── ...
├── worker/            # BullMQ Worker + AI Generation
│   ├── src/
│   │   ├── ai/            # LLM prompt builder + JSON validator
│   │   ├── models/        # Mongoose schemas (shared)
│   │   └── processor.ts   # Core processing logic
│   └── ...
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, Zustand, Socket.io-client |
| **Backend** | Node.js, Express, TypeScript, MongoDB (Mongoose), Redis, BullMQ, Socket.io |
| **Worker** | BullMQ Worker, Google Gemini 2.5 Flash, Zod validation |
| **Infra** | MongoDB, Redis |

## 🚀 Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Google Gemini API Key (free tier works)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install worker dependencies
cd ../worker
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

**Backend** (`backend/.env`):
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/veda-ai
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
```

**Worker** (`worker/.env`):
```
MONGODB_URI=mongodb://localhost:27017/veda-ai
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your-gemini-api-key-here
BACKEND_URL=http://localhost:4000
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

### 3. Start Services

```bash
# Terminal 1: MongoDB (if local)
mongod

# Terminal 2: Redis (if local)
redis-server

# Terminal 3: Backend
cd backend
npm run dev

# Terminal 4: Worker
cd worker
npm run dev

# Terminal 5: Frontend
cd frontend
npm run dev
```

Open http://localhost:3000 in your browser.

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assignments` | Create assignment + queue AI job |
| `GET` | `/api/assignments/:id` | Fetch assignment + result |
| `POST` | `/api/assignments/:id/regenerate` | Re-run AI generation |
| `GET` | `/api/health` | Health check |

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-assignment` | Client → Server | Join room for updates |
| `generation-complete` | Server → Client | Paper generated successfully |
| `generation-progress` | Server → Client | Progress updates |
| `generation-failed` | Server → Client | Generation error |

## 🧠 AI Output Format

```json
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "question": "What is the quadratic formula?",
          "difficulty": "easy",
          "marks": 2,
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "answer": "A) ..."
        }
      ]
    }
  ]
}
```

## ✨ Features

- ✅ Assignment creation form with validation
- ✅ AI-powered question generation (Google Gemini 2.5 Flash)
- ✅ Structured JSON output with validation
- ✅ Background processing with BullMQ
- ✅ Real-time WebSocket updates
- ✅ Clean exam paper layout
- ✅ Difficulty badges (easy/medium/hard)
- ✅ PDF export
- ✅ Regenerate button
- ✅ Redis caching
- ✅ Loading skeletons
- ✅ Error handling with retry
- ✅ File upload support
- ✅ Mobile responsive design

## 📄 License

MIT
