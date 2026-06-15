import Card from './components/card'
import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import './App.css'
import { SkeletonGrid } from './components/skeletonCard'


type CardType = {
  id: number
  pairId: number
  type: 'question' | 'answer'
  text: string
  isMatched: boolean
  isFaceDown: boolean
}

interface FlashcardItem {
  question: string;
  answer: string;
}

function shuffle(array: CardType[]) {
  for (let i = array.length - 1; i > 0 ; i--){
    const randmIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randmIndex]] = [array[randmIndex], array[i]];
  }
  return array
}

function createCards(flashcards : FlashcardItem[]) {
  const cards = flashcards.flatMap((item, index) => [
    {
      id: index * 2,
      pairId: index,
      type: 'question' as const,
      text: item.question,
      isFaceDown: true,
      isMatched: false
    },
    {
      id: index * 2 + 1,
      pairId: index,
      type: 'answer' as const,
      text: item.answer,
      isFaceDown: true,
      isMatched: false
    }
  ])
  return shuffle(cards)
}

function App() {
  const [cards, setCards] = useState<CardType[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [flippedCards, setFlippedCards] = useState<CardType[]>([])
  const [flashcardsData, setFlashcardsData] = useState<FlashcardItem[]>([])

  
  const restartBtnStyle: React.CSSProperties = {
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#3C3489',
  color: '#fff',
  cursor: 'pointer',
}

  
  useEffect(() => {
    console.log('useEffect run')
    fetch('http://localhost:3000/api/JsonFile') 
      .then((response) => response.json())
       .then(data => {
        // to test the skeleton 
      setTimeout(() => {          
        setFlashcardsData(data)
        setCards(createCards(data))
        setLoading(false)
      }, 3000)                    
    })
      .catch((error) => {
        console.error("Error fetching flashcards:", error);
        setLoading(false);
      });
  }, []);


const onCardClick = useCallback((cardId: number) => {
  setCards(prevCards => {
    const targetCard = prevCards.find(c => c.id === cardId)
    if (!targetCard || !targetCard.isFaceDown || targetCard.isMatched) return prevCards

    const flippedOpen = prevCards.filter(c => !c.isFaceDown && !c.isMatched)
    if (flippedOpen.length === 2) return prevCards // already 2 open, wait

    const updatedCards = prevCards.map(card =>
      card.id === cardId ? { ...card, isFaceDown: false } : card
    )

    const nowOpen = updatedCards.filter(c => !c.isFaceDown && !c.isMatched)

    if (nowOpen.length === 2) {
      const [first, second] = nowOpen
      if (first.pairId === second.pairId) {
        confetti({ particleCount: 50, spread: 60 })
        return updatedCards.map(card =>
          card.pairId === first.pairId ? { ...card, isMatched: true } : card
        )
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === first.id || card.id === second.id
              ? { ...card, isFaceDown: true }
              : card
          ))
        }, 1000)
      }
    }

    return updatedCards
  })
}, [])


 const hasWon = cards.length > 0 && cards.every(c => c.isMatched)

  function restart() {
    setCards(createCards(flashcardsData))
    setFlippedCards([])
  }

  if (loading) return <SkeletonGrid />   
  
   if (hasWon) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 You matched them all!</h2>
      <button onClick={restart} style={restartBtnStyle}>Play again</button>
    </div>
  )
  
  return (
    <>
     <header style={{ textAlign: 'center', padding: '2rem 0 0' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#3C3489' ,marginBottom:'0'}}>
        Dev Flash Match
      </h1>
      <p style={{ color: '#999', fontSize: '1.1rem', marginTop: '0' }}>
        Flip cards to match questions with their answers
      </p>
    </header>
    <div className="cards-container">
      {cards.map((card) => (
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
    </>
  )
}

export default App

