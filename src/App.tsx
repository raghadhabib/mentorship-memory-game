import Card from './components/card'
import flashcards from '../week_1.json'
import { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

type CardType = {
  id: number
  pairId: number
  type: 'question' | 'answer'
  text: string
  isMatched: boolean
  isFaceDown: boolean
}

function shuffle(array: CardType[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

function createCards(): CardType[] {
  const cards = flashcards.flatMap((item, index) => [
    { id: index * 2,     pairId: index, type: 'question' as const, text: item.question, isFaceDown: true, isMatched: false },
    { id: index * 2 + 1, pairId: index, type: 'answer'   as const, text: item.answer,   isFaceDown: true, isMatched: false },
  ])
  return shuffle(cards)
}

function App() {
  const [cards, setCards] = useState<CardType[]>(createCards)
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)

  const totalPairs = flashcards.length
  const matchedCount = cards.filter(c => c.isMatched).length / 2
  const allMatched = matchedCount === totalPairs

  const onCardClick = useCallback((cardid: number) => {
    // Prevent clicks when animating a mismatch, or clicking already-open card
    if (locked) return

    setCards(prev => {
      const clicked = prev.find(c => c.id === cardid)
      if (!clicked || clicked.isMatched || !clicked.isFaceDown) return prev

      const newCards = prev.map(c =>
        c.id === cardid ? { ...c, isFaceDown: false } : c
      )

      const faceUp = newCards.filter(c => !c.isFaceDown && !c.isMatched)

      if (faceUp.length === 2) {
        setMoves(m => m + 1)

        if (faceUp[0].pairId === faceUp[1].pairId) {
          // Match!
          const matched = newCards.map(c =>
            c.pairId === faceUp[0].pairId ? { ...c, isMatched: true } : c
          )
          const newMatchedCount = matched.filter(c => c.isMatched).length / 2
          if (newMatchedCount === totalPairs) {
            setTimeout(() => confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } }), 150)
          } else {
            confetti({ particleCount: 100, spread: 60 })
          }
          return matched
        } else {
          // Mismatch — lock board, flip back after delay
          setLocked(true)
          setTimeout(() => {
            setCards(prev2 => prev2.map(c =>
              !c.isFaceDown && !c.isMatched ? { ...c, isFaceDown: true } : c
            ))
            setLocked(false)
          }, 900)
          return newCards
        }
      }

      return newCards
    })
  }, [locked, totalPairs])

  function handleReset() {
    setCards(createCards())
    setMoves(0)
    setLocked(false)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1 className="app-title">Memory <em>Cards</em></h1>
            <p className="app-subtitle">Week 1 — Web Fundamentals</p>
          </div>
          <div className="header-actions">
            <span className="stat-chip">{matchedCount} / {totalPairs} matched</span>
            <span className="stat-chip moves">{moves} moves</span>
            <button className="reset-btn" onClick={handleReset}>Reset</button>
          </div>
        </div>
        <div className="progress-bar-wrap" role="progressbar" aria-valuenow={matchedCount} aria-valuemax={totalPairs}>
          <div className="progress-bar-fill" style={{ width: `${(matchedCount / totalPairs) * 100}%` }} />
        </div>
      </header>

      {allMatched && (
        <div className="win-banner">
          <p>
            All pairs matched! 🎉
            <span>Finished in {moves} moves</span>
          </p>
          <button className="play-again-btn" onClick={handleReset}>Play again</button>
        </div>
      )}

      <div className="cards-container">
        {cards.map(card => (
          <Card
            key={card.id}
            question={card.text}
            answer={card.text}
            type={card.type}
            isMatched={card.isMatched}
            onCardClick={onCardClick}
            isFaceDown={card.isFaceDown}
            cardid={card.id}
          />
        ))}
      </div>
    </div>
  )
}

export default App