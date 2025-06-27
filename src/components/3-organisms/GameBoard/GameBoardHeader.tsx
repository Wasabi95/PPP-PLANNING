// // src/components/3-organisms/GameBoard/GameBoardHeader.tsx
// import React from 'react';
// import PragmaLogo from '../../2-molecules/PragmaLogo/pragma-logo.component';
// import Avatar from '../../1-atoms/Avatar/avatar.component';
// import Button from '../../1-atoms/Button/button.component';
// import './game-board.component.scss';

// // A helper function, can be moved to a shared utils file
// const getInitials = (name: string): string => {
//   if (!name || typeof name !== 'string') return '';
//   const names = name.trim().toUpperCase().split(' ');
//   if (names.length === 1) return names[0].slice(0, 2);
//   return names[0][0] + names[1][0];
// };

// interface GameBoardHeaderProps {
//   gameName: string;
//   playerName: string;
//   onInviteClick: () => void;
// }

// const GameBoardHeader: React.FC<GameBoardHeaderProps> = ({ gameName, playerName, onInviteClick }) => (
//   <header className="game-board__header">
//     <PragmaLogo showText={false} iconSize={48} />
//     <h1 className="game-board__title">{gameName}</h1>
//     <div className="game-board__header-right">
//       <Avatar initials={getInitials(playerName)} />
//       <Button onClick={onInviteClick}>Invitar jugadores</Button>
//     </div>
//   </header>
// );

// export default GameBoardHeader;



// src/components/3-organisms/GameBoard/GameBoardHeader.tsx

import React from 'react';
import PragmaLogo from '../../2-molecules/PragmaLogo/pragma-logo.component';
import Avatar  from '../../1-atoms/Avatar/avatar.component';
import Button  from '../../1-atoms/Button/button.component';
import './game-board.component.scss';

const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  const names = name.trim().toUpperCase().split(' ');
  if (names.length === 1) return names[0].slice(0, 2);
  return names[0][0] + names[1][0];
};

// UPDATED: Add new props to the interface
interface GameBoardHeaderProps {
  gameName: string;
  playerName: string;
  onInviteClick: () => void;
  isHost: boolean;
  onAvatarClick: () => void;
}

const GameBoardHeader: React.FC<GameBoardHeaderProps> = ({ 
  gameName, 
  playerName, 
  onInviteClick, 
  isHost, 
  onAvatarClick 
}) => (
  <header className="game-board__header">
    <PragmaLogo showText={false} iconSize={48} />
    <h1 className="game-board__title">{gameName}</h1>
    <div className="game-board__header-right">
      {/* UPDATED: Wrap Avatar to make it clickable for the host */}
      <div
        className={`game-board__avatar-container ${isHost ? 'clickable' : ''}`}
        onClick={isHost ? onAvatarClick : undefined}
        title={isHost ? 'Host Settings' : playerName}
      >
        <Avatar initials={getInitials(playerName)} />
      </div>
      <Button onClick={onInviteClick}>Invitar jugadores</Button>
    </div>
  </header>
);

export default GameBoardHeader;