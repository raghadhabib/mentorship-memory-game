import Card from './components/card'
import flashcards from '../week_1.json'
import './App.css'

function App() {
  return (
    <>
      {flashcards.map((card, index) => (
        <Card key={index} question={card.question} answer={card.answer} />
      ))}
    </>
  )
}

export default App