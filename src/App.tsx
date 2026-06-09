import Card from './components/card'
import { useState, useEffect } from 'react'
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
  const [cards, setcards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  

  const [flippedCards, setFlippedCards] = useState<CardType[]>([]);

  
  useEffect(() => {
    fetch('http://localhost:3000/api/JsonFile') 
      .then((response) => response.json())
      .then((data) => {
        setcards(createCards(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching flashcards:", error);
        setLoading(false);
      });
  }, []);

  function onCardClick(cardid: number) { 
   
    if (flippedCards.length === 2) return; 
    
    const targetCard = cards.find(c => c.id === cardid);
    if (!targetCard || !targetCard.isFaceDown || targetCard.isMatched) return;

    
    const updatedCards = cards.map(card => 
      card.id === cardid ? { ...card, isFaceDown: false } : card
    );
    setcards(updatedCards);

    const currentFlipped = [...flippedCards, targetCard];
    setFlippedCards(currentFlipped);

    if (currentFlipped.length === 2) {
      const [firstCard, secondCard] = currentFlipped;

      if (firstCard.pairId === secondCard.pairId) {
       
        setcards(prevCards => 
          prevCards.map(card => 
            card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card
          )
        );
        confetti({ particleCount: 50 , spread: 60 });
        setFlippedCards([]);
      } else {

        setTimeout(() => {
          setcards(prevCards => 
            prevCards.map(card => 
              card.id === firstCard.id || card.id === secondCard.id 
                ? { ...card, isFaceDown: true } 
                : card
            )
          );
          setFlippedCards([]); 
        }, 1000);
      }
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Game Cards...</div>
  }      
  
  return (
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
  )
}

export default App

