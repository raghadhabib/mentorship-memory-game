import './card.css'

type CardProps = {
  question: string
  answer: string
}

export default function Card({ question, answer }: CardProps) {
  return (
    <div className="card">
      <p>{question}</p>
      <p>{answer}</p>
    </div>
  )
}