// src/components/3-organisms/GameBoard/PokerTable.tsx
// src/components/3-organisms/GameBoard/PokerTable.tsx

import React from 'react';
import PlayerSeat from '../../2-molecules/PlayerSeat/player-seat.component';
import Button from '../../1-atoms/Button/button.component';
import VoteCounterLoader from '../../2-molecules/VoteCounterLoader/vote-counter-loader.component';
import { type RoomState } from '../../../hooks/useRoomState';
import { type GamePhase } from './hooks/useGameBoardLogic';
// --- STEP 1: Import the hook to get the window size ---
import { useWindowSize } from './hooks/useWindowSize'; // Make sure this path is correct
import './game-board.component.scss';

// A helper function, can be moved to a shared utils file
const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  const names = name.trim().toUpperCase().split(' ');
  if (names.length === 1) return names[0].slice(0, 2);
  return names[0][0] + names[1][0];
};

// --- STEP 2: Define BOTH sets of positions ---
const DESKTOP_SEAT_POSITIONS = [
  { x: -140, y: -155 }, { x: 0, y: -155 }, { x: 120, y: -155 },
  { x: 330, y: 30 }, { x: -330, y: 30 },
  { x: 130, y: 160 }, { x: -140, y: 160 },
];

const MOBILE_SEAT_POSITIONS = [
  // TOP-LEFT
  { x: -130, y: -80 }, { x: 130, y: 70 }, 
  // TOP-RIGHT
  { x: 130, y: -80 },
  //lEFT MIDDLE
  { x: -130, y: 3 },
  // RIGHT-MIDDLE 
  { x: 130, y: 3 }, 
  // TOP- CENTER
  { x: 0, y: -170 }, 
  // BOTTOM-LEFT
  { x: -130, y: 70 }, 
  //
  { x: 0, y: 140 }, { x: 80, y: 110 },
];

interface PokerTableProps {
  players: RoomState['players'];
  currentUserName: string;
  gamePhase: GamePhase;
  canRevealVotes: boolean;
  isHost: boolean;
  onRevealVotes: () => void;
  onNewVote: () => void;
}

const PokerTable: React.FC<PokerTableProps> = ({
  players,
  currentUserName,
  gamePhase,
  canRevealVotes,
  isHost,
  onRevealVotes,
  onNewVote,
}) => {
  // --- STEP 3: Get the window width and choose the active array ---
  const { width: windowWidth } = useWindowSize();
  const activeSeatPositions = windowWidth <= 768 ? MOBILE_SEAT_POSITIONS : DESKTOP_SEAT_POSITIONS;

  const currentUserData = players.find(p => p.name === currentUserName);
  const otherPlayers = players.filter(p => p.name !== currentUserName);

  return (
    <main className="game-board__main-content">
      <div className="game-board__poker-table">
        {gamePhase === 'VOTING' && canRevealVotes && (
          <Button variant="cta" onClick={onRevealVotes}>Revelar cartas</Button>
        )}
        {gamePhase === 'REVEALING' && <VoteCounterLoader />}
        {gamePhase === 'REVEALED' && isHost && (
          <Button variant="cta" onClick={onNewVote}>Nueva Votación</Button>
        )}
      </div>

      {currentUserData && (
        <div key={currentUserData.name} className="player-seat-wrapper player-seat-wrapper--current-user">
          <PlayerSeat
            name={currentUserData.name}
            initials={getInitials(currentUserData.name)}
            isCurrentUser={true}
            hasVoted={!!currentUserData.vote}
            vote={currentUserData.vote}
            phase={gamePhase}
          />
        </div>
      )}

      {/* --- STEP 4: Use the 'activeSeatPositions' variable in the map loop --- */}
      {otherPlayers.map((p, index) => {
        const position = activeSeatPositions[index]; // Changed from SEAT_POSITIONS
        if (!position) return null;
        return (
          <div key={p.name} className="player-seat-wrapper" style={{ '--x': `${position.x}px`, '--y': `${position.y}px` } as React.CSSProperties}>
            <PlayerSeat
              name={p.name}
              initials={getInitials(p.name)}
              isCurrentUser={false}
              hasVoted={!!p.vote}
              vote={p.vote}
              phase={gamePhase}
            />
          </div>
        );
      })}
    </main>
  );
};

export default PokerTable;