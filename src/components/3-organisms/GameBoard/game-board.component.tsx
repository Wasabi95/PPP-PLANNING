// // src/components/3-organisms/GameBoard/game-board.component.tsx
// src/components/3-organisms/GameBoard/game-board.component.tsx

import React, { useState } from 'react';

// Import all the child components that make up the game board
import GameBoardHeader from './GameBoardHeader';
import PokerTable from './PokerTable';
import GameBoardFooter from './GameBoardFooter';
import Modal from '../Modal/modal.component';
import InvitePlayers from '../../2-molecules/InvitePlayers/invite-players.component';

// Import the hook that provides all the game logic and state
import { useGameBoardLogic, type Player } from './hooks/useGameBoardLogic';

import './game-board.component.scss';

// The props this top-level component needs to function
interface GameBoardProps {
  player: Player | null;
  gameName: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ player, gameName }) => {
  // State for managing the visibility of the "Invite Players" modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isLoading,
    roomState,
    gamePhase,
    isHost,
    canRevealVotes,
    currentUserVote, // This is the 'selectedValue' for the CardDeck
    voteResults,
    handleCardSelect, // This is the 'onCardSelect' for the CardDeck
    handleRevealVotes,
    handleNewVote,
  } = useGameBoardLogic(gameName, player);

  // A crucial loading state to prevent errors before the room data arrives
  if (isLoading || !roomState || !player) {
    return <div className="game-board">Cargando sala...</div>;
  }

  // A helper class to apply a blur effect when the modal is open
  const boardClassName = `game-board ${isModalOpen ? 'blurred' : ''}`;

  return (
    <>
      <div className={boardClassName}>
        {/* Pass the required props to the Header */}
        <GameBoardHeader
          gameName={roomState.gameName}
          playerName={player.name}
          onInviteClick={() => setIsModalOpen(true)}
        />

        {/* Pass the required props to the PokerTable */}
        <PokerTable
          players={roomState.players}
          currentUserName={player.name}
          gamePhase={gamePhase}
          canRevealVotes={canRevealVotes}
          isHost={isHost}
          onRevealVotes={handleRevealVotes}
          onNewVote={handleNewVote}
        />

        {/* Pass the required props to the Footer */}
        <GameBoardFooter
          gamePhase={gamePhase}
          onCardSelect={handleCardSelect}
          selectedValue={currentUserVote}
          voteResults={voteResults}
        />
      </div>

      {/* The modal lives outside the main board so it can overlay everything */}
      <Modal title="Invitar jugadores" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InvitePlayers gameId={gameName} />
      </Modal>
    </>
  );
};

export default GameBoard;


