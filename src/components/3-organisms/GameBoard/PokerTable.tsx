// src/components/3-organisms/GameBoard/PokerTable.tsx
import React from 'react';
import PlayerSeat from '../../2-molecules/PlayerSeat/player-seat.component';
import Button from '../../1-atoms/Button/button.component';
import VoteCounterLoader from '../../2-molecules/VoteCounterLoader/vote-counter-loader.component';
import { type RoomState } from '../../../hooks/useRoomState';
import { type GamePhase } from './hooks/useGameBoardLogic';
import './game-board.component.scss';

// A helper function, can be moved to a shared utils file
const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  const names = name.trim().toUpperCase().split(' ');
  if (names.length === 1) return names[0].slice(0, 2);
  return names[0][0] + names[1][0];
};


const SEAT_POSITIONS = [
  { x: -140, y: -155 }, { x: 0, y: -155 }, { x: 120, y: -155 },
  { x: 330, y: 30 }, { x: -330, y: 30 },
  { x: 130, y: 160 }, { x: -140, y: 160 },
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

      {otherPlayers.map((p, index) => {
        const position = SEAT_POSITIONS[index];
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