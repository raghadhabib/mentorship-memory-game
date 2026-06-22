import Card from "./components/card";
import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import "./App.css";
import { SkeletonGrid } from "./components/skeletonCard";
import { cardState, type CardType, type FlashcardItem } from "../type";

function shuffle(array: CardType[]): CardType[] {
  for (let i = array.length - 1; i > 0; i--) {
    const randmIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randmIndex]] = [array[randmIndex], array[i]];
  }
  return array;
}

function createCards(flashcards: FlashcardItem[]) {
  const cards = flashcards.flatMap((item, index) => [
    {
      id: index * 2,
      pairId: index,
      type: "question" as const,
      text: item.question,
      state: cardState.faceDown,
    },
    {
      id: index * 2 + 1,
      pairId: index,
      type: "answer" as const,
      text: item.answer,
      state: cardState.faceDown,
    },
  ]);
  return shuffle(cards);
}

function App() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [flashcardsData, setFlashcardsData] = useState<FlashcardItem[]>([]);
  const [level, setLevel] = useState<string | null>(null);

  const restartBtnStyle: React.CSSProperties = {
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    background: "#3C3489",
    color: "#fff",
    cursor: "pointer",
    width: "35%",
  };

  useEffect(() => {
    console.log("useEffect run");
    if (!level) return;
    fetch(`http://api-1m5w.onrender.com/api/JsonFile/${level}`)
      .then((response) => response.json())
      .then((data) => {
        // to test the skeleton
        setTimeout(() => {
          setFlashcardsData(data);
          setCards(createCards(data));
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error fetching flashcards:", error);
        setLoading(false);
      });
  }, [level]);

  const onCardClick = useCallback((cardId: number) => {
    setCards((prevCards) => {
      const targetCard = prevCards.find((card) => card.id === cardId);

      //before we refine the state using enum cardState
      // if (!targetCard || !targetCard.isFaceDown || targetCard.isMatched) return prevCards

      // return the previous card if there is no card selected or the card selected is (face down + unmatched )
      if (!targetCard || targetCard.state !== cardState.faceDown)
        return prevCards;

      //before
      // const flippedOpen = prevCards.filter(card => !card.isFaceDown && !card.isMatched)
      // if (flippedOpen.length === 2) return prevCards

      //return the previous card if the 2 cards selected is unmatced after we flipped its faced up
      const flippedOpen = prevCards.filter(
        (card) => card.state === cardState.FaceUpUnmatched,
      );
      if (flippedOpen.length === 2) return prevCards;

      //before
      // const updatedCards = prevCards.map(card =>
      //   card.id === cardId ? { ...card, isFaceDown: false } : card
      // )

      //flipping card open
      const updatedCards = prevCards.map((card) =>
        card.id === cardId
          ? { ...card, state: cardState.FaceUpUnmatched }
          : card,
      );

      //before
      // const nowOpen = updatedCards.filter(c => !c.isFaceDown && !c.isMatched)

      //matched cards
      const nowOpen = updatedCards.filter(
        (card) => card.state === cardState.FaceUpUnmatched,
      );

      //before
      // if (nowOpen.length === 2) {
      //   const [first, second] = nowOpen
      //   if (first.pairId === second.pairId) {
      //     confetti({ particleCount: 50, spread: 60 })
      //     return updatedCards.map(card =>
      //       card.pairId === first.pairId ? { ...card, isMatched: true } : card
      //     )
      //   } else {
      //     setTimeout(() => {
      //       setCards(prev => prev.map(card =>
      //         card.id === first.id || card.id === second.id
      //           ? { ...card, isFaceDown: true }
      //           : card
      //       ))
      //     }, 1000)
      //   }
      // }

      //after
      console.log("now open", { nowOpen });
      if (nowOpen.length === 2) {
        const [first, second] = nowOpen;

        if (first.pairId === second.pairId) {
          confetti({ particleCount: 50, spread: 60 });
          return updatedCards.map(
            (card) =>
              card.pairId === first.pairId
                ? { ...card, state: cardState.FaceUpmatched }
                : card, //match
          );
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                card.id === first.id || card.id === second.id
                  ? { ...card, state: cardState.faceDown } //mismatch
                  : card,
              ),
            );
          }, 1000);
        }
      }

      return updatedCards;
    });
  }, []);

  if (!level) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h1 style={{ color: "#3C3489" }}>Choose your level</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyItems: "center",
            alignItems: "center",
            marginTop: "1.5rem",
          }}
        >
          <button onClick={() => setLevel("1")} style={restartBtnStyle}>
            Easy Peasy
          </button>
          <button onClick={() => setLevel("2")} style={restartBtnStyle}>
            Getting Warm
          </button>
          <button onClick={() => setLevel("3")} style={restartBtnStyle}>
            Serious Mode
          </button>
          <button onClick={() => setLevel("4")} style={restartBtnStyle}>
            Unforgettable
          </button>
        </div>
      </div>
    );
  }

  const hasWon =
    cards.length > 0 &&
    cards.every((card) => card.state === cardState.FaceUpmatched);

  function restart() {
    setLevel(null);
    setCards(createCards(flashcardsData));
  }

  if (loading) return <SkeletonGrid />;

  if (hasWon)
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🎉 You matched them all!
        </h2>
        <button onClick={restart} style={restartBtnStyle}>
          Play again
        </button>
      </div>
    );

  return (
    <>
      <header style={{ textAlign: "center", padding: "2rem 0 0" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "#3C3489",
            marginBottom: "0",
          }}
        >
          Dev Flash Match
        </h1>
        <p style={{ color: "#999", fontSize: "1.1rem", marginTop: "0" }}>
          Flip cards to match questions with their answers
        </p>
      </header>
      <div className="cards-container">
        {cards.map((card) => (
          <Card
            key={card.id}
            question={card.text}
            answer={card.text}
            type={card.type}
            onCardClick={onCardClick}
            state={card.state}
            cardid={card.id}
          />
        ))}
      </div>
    </>
  );
}

export default App;
