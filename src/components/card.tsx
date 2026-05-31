import './card.css'

type CardProps = {
  question: string
  answer: string
  type: 'question' | 'answer'
  isMatched: boolean
  isFaceDown: boolean

  onCardClick: (cardid: number) => void
  cardid: number
}


export default function Card({ question, answer, type, isMatched, onCardClick, isFaceDown, cardid }: CardProps) { 

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