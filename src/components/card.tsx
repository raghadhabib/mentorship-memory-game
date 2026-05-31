import './card.css'

type CardProps = {
  question: string
  answer: string
  type: 'question' | 'answer'
  isFaceDown: boolean
  isMatched: boolean
  onClick: (cardid: number) => void
  cardid: number
}


export default function Card({ question, answer, type, isFaceDown, isMatched, onClick, cardid }: CardProps) {
  
  const text = type === 'question' ? question : answer
  const condition =isFaceDown ? 'face-down' : ''
  const className = `card ${condition} ${isMatched ? 'matched' : ''}`


  return (
    <div className={className} onClick={()=> onClick(cardid)}>
      {!isFaceDown && <span className="card-label">{type}</span>}
      {!isFaceDown && <p className="card-text">{text}</p>}
    </div>
  )
}