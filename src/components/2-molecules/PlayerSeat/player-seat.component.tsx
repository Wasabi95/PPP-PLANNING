// // src/components/2-molecules/PlayerSeat/player-seat.component.tsx
// import React from 'react';
// import Avatar from '../../1-atoms/Avatar/avatar.component';
// import { type CardValue } from '../../../hooks/useRoomState';
// import './player-seat.component.scss';

// interface PlayerSeatProps {
//   name: string;
//   initials: string;
//   isCurrentUser: boolean;
//   hasVoted: boolean;
//   vote?: CardValue;
//   phase: 'VOTING' | 'REVEALING' | //'REVEALED';
// }

// const PlayerSeat: React.FC<PlayerSeatProps> = ({
//   name,
//   initials,
//   isCurrentUser,
//   hasVoted,
//   vote,
//   phase,
// }) => {
//   const wrapperClasses = `player-seat ${isCurrentUser ? 'is-current-user' : ''}`;

//   // We will build the content for the card area with simple if/else logic.
//   // This is more robust than a complex nested ternary.
//   let cardAreaContent;

//   // RULE 1: If the phase is REVEALED AND there is a vote, show the revealed card.
//   if (phase === 'REVEALED' && vote !== undefined) {
//     cardAreaContent = (
//       <div className="player-seat__revealed-card">
//         <span className="player-seat__revealed-vote">{String(vote)}</span>
//       </div>
//     );
//   } 
//   // RULE 2: If it's the current user (and RULE 1 was false), show the avatar.
//   else if (isCurrentUser) {
//     cardAreaContent = <Avatar initials={initials} hasVoted={hasVoted} />;
//   } 
//   // RULE 3: If it's any other player (and RULE 1 was false), show the placeholder.
//   else {
//     cardAreaContent = (
//       <div
//       data-testid="card-placeholder"
//         className={`card-placeholder ${
//           hasVoted ? 'card-placeholder--voted' : ''
//         }`}
//       >
//         <div className="card-placeholder__vote-indicator"></div>
//       </div>
//     );
//   }

//   // Now, we render the final component with the correctly determined content.
//   return (
//     <div className={wrapperClasses}>
//       <div className="player-seat__card-area">{cardAreaContent}</div>
//       <div className="player-seat__name">{name}</div>
//     </div>
//   );
// };

// export default PlayerSeat;



// src/components/2-molecules/PlayerSeat/player-seat.component.tsx
import React from 'react';
import Avatar from '../../1-atoms/Avatar/avatar.component';
import { type CardValue } from '../../../hooks/useRoomState';
import './player-seat.component.scss';

// THIS IS THE BLUEPRINT THAT NEEDS TO BE UPDATED
interface PlayerSeatProps {
  name: string;
  initials: string;
  isCurrentUser: boolean;
  hasVoted: boolean;
  vote?: CardValue;
  phase: 'VOTING' | 'REVEALING' | 'REVEALED';
  // NEW: Add the properties being passed down from PokerTable
  isRevealer: boolean;
  isHost: boolean; // Accept this prop even if not used directly in the UI
  onAssignRevealer: (playerName: string) => void; // Accept this prop
}

const PlayerSeat: React.FC<PlayerSeatProps> = ({
  name,
  initials,
  isCurrentUser,
  hasVoted,
  vote,
  phase,
  // NEW: Accept the 'isRevealer' prop to use it in the UI
  isRevealer,
}) => {
  // UPDATED: Add a highlight class if this player is the current revealer
  const wrapperClasses = `player-seat ${isCurrentUser ? 'is-current-user' : ''} ${isRevealer ? 'is-revealer-highlight' : ''}`;

  let cardAreaContent;

  if (phase === 'REVEALED' && vote !== undefined) {
    cardAreaContent = (
      <div className="player-seat__revealed-card">
        <span className="player-seat__revealed-vote">{String(vote)}</span>
      </div>
    );
  } 
  else if (isCurrentUser) {
    cardAreaContent = <Avatar initials={initials} hasVoted={hasVoted} />;
  } 
  else {
    cardAreaContent = (
      <div
        data-testid="card-placeholder"
        className={`card-placeholder ${hasVoted ? 'card-placeholder--voted' : ''}`}
      >
        <div className="card-placeholder__vote-indicator"></div>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <div className="player-seat__card-area">{cardAreaContent}</div>
      {/* UPDATED: The name container now conditionally shows the revealer icon */}
      <div className="player-seat__name">
        {name}
        {isRevealer && (
          <span className="revealer-icon" title="Current Revealer">
            👑
          </span>
        )}
      </div>
    </div>
  );
};

export default PlayerSeat;