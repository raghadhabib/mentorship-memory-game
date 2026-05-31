import Card from './components/card'
import flashcards from '../week_1.json'
import { useState } from 'react'
import './App.css'


type CardType = {
  id: number
  pairId: number
  type: 'question' | 'answer'
  text: string
  isFaceDown: boolean
  isMatched: boolean
}


function shuffle(array: CardType[]) {
    for (let i = array.length - 1; i > 0 ; i--){
      const randmIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randmIndex]] = [array[randmIndex], array[i]];

    }
    return array
  }


function createCards() {
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
  const [cards, setcards] = useState<CardType[]>(createCards);
  const [flippedCards, setFlippedCards] = useState<CardType[]>([])

function resetCards() {
  setFlippedCards([])
      setcards(prevCards => prevCards.map(card => {
        if (card.isFaceDown || card.isMatched) {
          return card
        }
        return { ...card, isFaceDown: true }

      }))
      
}
  function onCardClick(cardid: number) {
    if (flippedCards.length === 2) {
      resetCards()
    }
    const targetCard = cards.find(card => card.id === cardid)
    if (!targetCard) {
      return
    }

    setFlippedCards(prev => [...prev, targetCard])
    const [firstCard, secondCard] = flippedCards
    setcards(prevCards => prevCards.map(card => {
      if (card.id === cardid) {
        
        return { ...card, isFaceDown: false }
      }

      if ((firstCard?.pairId === secondCard?.pairId) && (card.id === firstCard?.id || card.id === secondCard?.id)) {
      
        return { ...card, isMatched: true }
      }
    
      return card
    }))

  
  }
    
   
  
  

  
  return (
    <div className="cards-container">
      {cards.map((card) => (
        
          <Card key={card.id} question={card.text} answer={card.text} type={card.type} isFaceDown={card.isFaceDown} isMatched={card.isMatched} onClick={onCardClick} cardid={card.id} />
          
        
      ))}
    </div>
  )
}

export default App

