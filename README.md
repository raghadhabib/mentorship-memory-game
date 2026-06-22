# 🃏 Dev Flash Match

A developer-themed memory card matching game built with React and TypeScript. Flip cards to match programming questions with their answers — and race against yourself to match them all!

---

## 🎮 How to Play

1. Choose a difficulty level
2. Cards start face-down — click any card to flip it
3. Try to find its matching pair (question ↔ answer)
4. Match all pairs to win 🎉

---

## ✨ Features

- **4 difficulty levels** — Easy Peasy → Unforgettable
- **Dynamic flashcard data** fetched from an Express backend per level
- **Skeleton loading screen** while cards are being fetched
- **Confetti celebration** on every matched pair via `canvas-confetti`
- **Win screen** with a Play Again option

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 19 | UI and state management |
| TypeScript | Type safety |
| Vite | Dev server and bundler |
| `canvas-confetti` | Confetti effect on match |

### Backend
| Tool | Purpose |
|------|---------|
| Express | REST API serving flashcard JSON files |
| TypeScript | Typed backend |

---

## 🧠 Key Concepts Applied

- **`cardState` enum** — models card state as a sum type (`faceDown`, `FaceUpUnmatched`, `FaceUpMatched`) instead of multiple booleans — *"Make Invalid State Unrepresentable"*
- **Fisher-Yates shuffle** — for fair, unbiased card randomization
- **`useCallback`** — memoizes `onCardClick` to prevent unnecessary re-renders
- **`memo()`** — wraps the `Card` component so only changed cards re-render
- **Functional updater pattern** — `setCards(prev => ...)` used inside `useCallback` to avoid stale closure bugs
- **`flatMap`** — generates question + answer card pairs from each flashcard item
- **Dynamic API routing** — backend serves different JSON files based on level parameter (`/api/JsonFile/:level`)

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── card.tsx          # Memoized card component
│   │   ├── card.css
│   │   ├── skeletonCard.tsx  # Skeleton loader grid
│   │   └── skeletonCard.css
│   ├── App.tsx               # Main game logic
│   └── main.tsx
├── type.ts                   # Shared CardType, FlashcardItem, cardState
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- Backend server running on `http://localhost:3000`

### Install & Run

```bash
# Install dependencies
npm install

# Start the frontend
npm run dev
```

---

## 👩‍💻 Built By

Raghad — junior frontend developer, currently in a structured mentorship program through [Wasla Connect](https://waslaconnect.com), building real projects with React and TypeScript.
