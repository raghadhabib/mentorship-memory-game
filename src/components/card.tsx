import './card.css'
import { memo } from 'react'


type CardProps = {
  question: string
  answer: string
  type: 'question' | 'answer'
  isMatched: boolean
  isFaceDown: boolean
  onCardClick: (cardid: number) => void
  cardid: number
}


const Card = memo(
   function Card({ question, answer, type, isMatched, onCardClick, isFaceDown, cardid }: CardProps)
{ 
  console.log(`Card component with ID: ${cardid} is rendering!`);

  const text = type === 'question' ? question : answer
  const condition = isFaceDown ? 'face-down' : ''
  const matchedClass = isMatched ? 'matched' : ''
  const className = `card ${condition} ${matchedClass}`
  
      
  
  return (
    <div className={className} onClick={() => onCardClick(cardid)}>
      {!isFaceDown && <span className="card-label">{type}</span>}
      {!isFaceDown && <p className="card-text">{text}</p>}
    </div>
  )
}
)


export default Card