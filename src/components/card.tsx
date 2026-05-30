import './card.css'

type CardProps = {
  question: string
  answer: string
  type: 'question' | 'answer'
  isFaceDown: boolean
  isMatched: boolean
}

export default function Card({ question, answer, type, isFaceDown, isMatched }: CardProps) {
  
  const text = type === 'question' ? question : answer
  const className = `card ${isFaceDown ? 'face-down' : ''} ${isMatched ? 'matched' : ''}`

  return (
    <div className={className}>
      {!isFaceDown && <span className="card-label">{type}</span>}
      {!isFaceDown && <p className="card-text">{text}</p>}
    </div>
  )
}