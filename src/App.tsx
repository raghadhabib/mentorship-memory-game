import Card from './components/card'
import flashcards from '../week_1.json'
import './App.css'

function App() {
  return (
    <div className="cards-container">
      {flashcards.map((card, index) => (
        <>
          <Card key={`q-${index}`} question={card.question} answer={card.answer} type="question" isFaceDown={true} isMatched={false} />
          <Card key={`a-${index}`} question={card.question} answer={card.answer} type="answer" isFaceDown={true} isMatched={false} />
        </>
      ))}
    </div>
  )
}

export default App

