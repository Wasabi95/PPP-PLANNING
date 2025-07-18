// // src/components/3-organisms/GameBoard/GameBoardFooter.tsx
// import React from 'react';
// import CardDeck from '../../2-molecules/CardDeck/card-deck.component';
// import VoteResults from '../../2-molecules/VoteResults/vote-results.component';
// import { type CardValue } from '../../../hooks/useRoomState';
// import { type GamePhase } from './hooks/useGameBoardLogic';
// import './game-board.component.scss';

// interface GameBoardFooterProps {
//   gamePhase: GamePhase;
//   onCardSelect: (value: CardValue) => void;
//   selectedValue?: CardValue;
//   voteResults: { voteCounts: Record<string, number>; average: string };
// }

// const GameBoardFooter: React.FC<GameBoardFooterProps> = ({
//   gamePhase,
//   onCardSelect,
//   selectedValue,
//   voteResults,
// }) => (
//   <footer className="game-board__footer">
//     {gamePhase === 'VOTING' && (
//       <CardDeck onCardSelect={onCardSelect} selectedValue={selectedValue} />
//     )}
//     {gamePhase === 'REVEALED' && (
//       <VoteResults voteCounts={voteResults.voteCounts} average={voteResults.average} />
//     )}
//   </footer>
// );

// export default GameBoardFooter;



// src/components/3-organisms/GameBoard/GameBoardFooter.tsx

// src/components/3-organisms/GameBoard/GameBoardFooter.tsx

import React from 'react';
import CardDeck from '../../2-molecules/CardDeck/card-deck.component';
import VoteResults from '../../2-molecules/VoteResults/vote-results.component';
import { type CardValue } from '../../../hooks/useRoomState';
import { type GamePhase } from './hooks/useGameBoardLogic';
import './game-board.component.scss';

// UPDATED: The props interface
interface GameBoardFooterProps {
  gamePhase: GamePhase;
  onCardSelect: (value: CardValue) => void;
  selectedValue?: CardValue;
  voteResults: { voteCounts: Record<string, number>; average: string };
  // NEW: Add the deck prop here
  deck: CardValue[];
}

const GameBoardFooter: React.FC<GameBoardFooterProps> = ({
  gamePhase,
  onCardSelect,
  selectedValue,
  voteResults,
  // NEW: Accept the deck prop here
  deck,
}) => (
  <footer className="game-board__footer">
    {/* When voting, show the CardDeck and pass the dynamic deck to it */}
    {gamePhase === 'VOTING' && (
      <CardDeck
        // NEW: Pass the deck down to the CardDeck component
        deck={deck}
        onCardSelect={onCardSelect}
        selectedValue={selectedValue}
      />
    )}
    
    {/* When revealed, show the results */}
    {gamePhase === 'REVEALED' && (
      <VoteResults voteCounts={voteResults.voteCounts} average={voteResults.average} />
    )}
  </footer>
);

export default GameBoardFooter;