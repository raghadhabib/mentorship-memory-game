import "./card.css";
import { memo } from "react";
import { cardState } from "../../type";

type CardProps = {
  question: string;
  answer: string;
  type: "question" | "answer"; //union (Sum type)
  state: cardState;
  onCardClick: (cardid: number) => void;
  cardid: number;
};

const Card = memo(function Card({
  question,
  answer,
  type,
  onCardClick,
  cardid,
  state,
}: CardProps) {
  console.log(`Card component with ID: ${cardid} is rendering!`);

  const text = type === "question" ? question : answer;
  const condition = state === cardState.faceDown ? "face-down" : "flipping";
  const matchedClass = state === cardState.FaceUpmatched ? "matched" : "";
  const className = `card ${condition} ${matchedClass}`;

  return (
    <div className={className} onClick={() => onCardClick(cardid)}>
      {state !== cardState.faceDown && (
        <span className="card-label">{type}</span>
      )}
      {state !== cardState.faceDown && <p className="card-text">{text}</p>}
    </div>
  );
});

export default Card;
