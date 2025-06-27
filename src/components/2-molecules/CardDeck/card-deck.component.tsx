// //src/components/2-molecules/CardDeck/card-deck.component.tsx
// import React from 'react';
// import VotingCard from '../../1-atoms/VotingCard/voting-card.component';
// import { type CardValue } from '../../../hooks/useRoomState';
// import './card-deck.component.scss';

// interface CardDeckProps {
//   onCardSelect: (value: CardValue) => void;
//   selectedValue?: CardValue;
// }

// const DECK_VALUES: CardValue[] = [0, 1, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'];

// const CardDeck: React.FC<CardDeckProps> = ({ onCardSelect, selectedValue }) => {
//   return (
//     <div className="card-deck">
//       <h2 className="card-deck__title">
//         Elige una carta <span className="icon">👇</span>
//       </h2>
//       <div className="card-deck__grid">
//         {DECK_VALUES.map((value) => (
//           <VotingCard
//             key={value}
//             value={value}
//             isSelected={selectedValue === value}
//             onClick={() => onCardSelect(value)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CardDeck;


// src/components/2-molecules/CardDeck/card-deck.component.tsx

import React from 'react';
import VotingCard from '../../1-atoms/VotingCard/voting-card.component';
import { type CardValue } from '../../../hooks/useRoomState';
import './card-deck.component.scss';

// THIS IS THE BLUEPRINT THAT NEEDS TO BE UPDATED
interface CardDeckProps {
  onCardSelect: (value: CardValue) => void;
  selectedValue?: CardValue;
  // NEW: Add the deck prop here
  deck: CardValue[];
}

// REMOVE THIS HARD-CODED CONSTANT
// const DECK_VALUES: CardValue[] = [0, 1, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'];

const CardDeck: React.FC<CardDeckProps> = ({ 
  onCardSelect, 
  selectedValue, 
  // NEW: Accept the deck prop here
  deck 
}) => {
  return (
    <div className="card-deck">
      <h2 className="card-deck__title">
        Elige una carta <span className="icon">👇</span>
      </h2>
      <div className="card-deck__grid">
        {/* UPDATED: Map over the 'deck' prop instead of the old constant */}
        {deck.map((value) => (
          <VotingCard
            key={String(value)} // Use String(value) for a more robust key
            value={value}
            isSelected={selectedValue === value}
            onClick={() => onCardSelect(value)}
          />
        ))}
      </div>
    </div>
  );
};

export default CardDeck;