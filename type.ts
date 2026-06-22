export enum cardState {
  faceDown = "FaceDownUnmatched",
  FaceUpmatched = "FaceUpmatched",
  FaceUpUnmatched = "FaceUpUnmatched",
}

export type CardType = {
  id: number;
  pairId: number;
  type: "question" | "answer"; //sum type
  text: string;
  state: cardState;
};

export type FlashcardItem = {
  question: string;
  answer: string;
};
