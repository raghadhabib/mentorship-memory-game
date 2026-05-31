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
      isFaceDown: false,
      isMatched: false
    },
    {
      id: index * 2 + 1,
      pairId: index,
      type: 'answer' as const,
      text: item.answer,
      isFaceDown: false,
      isMatched: false
    }
  ])
   return shuffle(cards)
  }


function App() {
  const [cards, setCards] = useState<CardType[]>(createCards);

  
  return (
    <div className="cards-container">
      {cards.map((card) => (
        
          <Card key={card.id} question={card.text} answer={card.text} type={card.type} isFaceDown={card.isFaceDown} isMatched={card.isMatched} />
          
        
      ))}
    </div>
  )
}

export default App

