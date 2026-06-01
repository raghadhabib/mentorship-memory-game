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

  let className = 'card'
  if (isFaceDown) className += ' face-down'
  if (isMatched) className += ' matched'
  if (!isFaceDown && !isMatched) className += ' card-flip-enter'

  return (
    <div className={className} onClick={() => !isMatched && onCardClick(cardid)}>
      {isFaceDown && <span className="card-face-down-icon">?</span>}
      {!isFaceDown && (
        <>
          <span className={`card-label ${type}`}>{type}</span>
          {isMatched && <span className="matched-checkmark" aria-label="matched" />}
          <p className="card-text">{text}</p>
        </>
      )}
    </div>
  )
}