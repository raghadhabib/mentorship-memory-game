import Card from './components/card'
import flashcards from '../week_1.json'
import { useState } from 'react'
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

  function onCardClick(cardid: number) {
    
    setcards((prevCards) =>
      {
      
      let newCard = prevCards.map((card) => {
      if (card.id === cardid && card.isMatched === false) {
        return { ...card, isFaceDown: false }
      }
      return card
    })
  const facedUpCards = newCard.filter((card) => !card.isFaceDown && !card.isMatched)
  
  if(facedUpCards.length === 2) {
      if (facedUpCards[0].pairId === facedUpCards[1].pairId) {
        newCard = newCard.map((card) => {
          if (card.pairId === facedUpCards[0].pairId) {
              confetti({ particleCount: 50 , spread: 60 })
              return { ...card, isMatched: true }
          }
          return card
      })

       return newCard
      }
      
      else{
        newCard=newCard.map((card) => {
          if (card.isFaceDown === false && card.isMatched === false) {
            return { ...card, isFaceDown: true }
          }
          return card
        })
      }
      
    }
     return newCard
 
  })
    

    
    

 
  }

        
      
  
  return (
    <div className="cards-container">
      {cards.map((card) => (

          <Card key={card.id} question={card.text} answer={card.text} type={card.type} isMatched={card.isMatched} onCardClick={onCardClick} isFaceDown={card.isFaceDown} cardid={card.id} />
          
        
      ))}
    </div>
  )
}

export default App
  
