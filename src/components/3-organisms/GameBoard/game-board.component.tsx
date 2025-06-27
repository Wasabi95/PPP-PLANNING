// // // src/components/3-organisms/GameBoard/game-board.component.tsx
// import React, { useState } from 'react';
// import GameBoardHeader from './GameBoardHeader';
// import PokerTable from './PokerTable';
// import GameBoardFooter from './GameBoardFooter';
// import Modal from '../Modal/modal.component';
// import InvitePlayers from '../../2-molecules/InvitePlayers/invite-players.component';
// import { useGameBoardLogic, type Player } from './hooks/useGameBoardLogic';
// import './game-board.component.scss';


// interface GameBoardProps {
//   player: Player | null;
//   gameName: string;
// }

// const GameBoard: React.FC<GameBoardProps> = ({ player, gameName }) => {
//   // State for managing the visibility of the "Invite Players" modal
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const {
//     isLoading,
//     roomState,
//     gamePhase,
//     isHost,
//     canRevealVotes,
//     currentUserVote, // This is the 'selectedValue' for the CardDeck
//     voteResults,
//     handleCardSelect, // This is the 'onCardSelect' for the CardDeck
//     handleRevealVotes,
//     handleNewVote,
//   } = useGameBoardLogic(gameName, player);

//   // A crucial loading state to prevent errors before the room data arrives
//   if (isLoading || !roomState || !player) {
//     return <div className="game-board">Cargando sala...</div>;
//   }

//   // A helper class to apply a blur effect when the modal is open
//   const boardClassName = `game-board ${isModalOpen ? 'blurred' : ''}`;

//   return (
//     <>
//       <div className={boardClassName}>
//         {/* Pass the required props to the Header */}
//         <GameBoardHeader
//           gameName={roomState.gameName}
//           playerName={player.name}
//           onInviteClick={() => setIsModalOpen(true)}
//         />

//         {/* Pass the required props to the PokerTable */}
//         <PokerTable
//           players={roomState.players}
//           currentUserName={player.name}
//           gamePhase={gamePhase}
//           canRevealVotes={canRevealVotes}
//           isHost={isHost}
//           onRevealVotes={handleRevealVotes}
//           onNewVote={handleNewVote}
//         />

//         {/* Pass the required props to the Footer */}
//         <GameBoardFooter
//           gamePhase={gamePhase}
//           onCardSelect={handleCardSelect}
//           selectedValue={currentUserVote}
//           voteResults={voteResults}
//         />
//       </div>

//       {/* The modal lives outside the main board so it can overlay everything */}
//       <Modal title="Invitar jugadores" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <InvitePlayers gameId={gameName} />
//       </Modal>
//     </>
//   );
// };

// export default GameBoard;




// src/components/3-organisms/GameBoard/game-board.component.tsx

import React, { useState } from 'react';
// CORRECTED: The file name is game-board.component, not GameBoardHeader
import GameBoardHeader from './GameBoardHeader'; 
import PokerTable from './PokerTable';
import GameBoardFooter from './GameBoardFooter';
import  Modal  from '../Modal/modal.component'; // Keep your existing Modal for inviting
// NEW: Import the HostSettingsModal we created
import { HostSettingsModal } from '../../2-molecules/HostSettingsModal/host-settings-modal.component'; 
import InvitePlayers from '../../2-molecules/InvitePlayers/invite-players.component';
import { useGameBoardLogic, type Player } from './hooks/useGameBoardLogic';
import './game-board.component.scss';

interface GameBoardProps {
  player: Player | null;
  gameName: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ player, gameName }) => {
  // State for your existing "Invite Players" modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  // NEW: State for the new "Host Settings" modal
  const [isHostSettingsOpen, setIsHostSettingsOpen] = useState(false);

  const {
    isLoading,
    roomState,
    gamePhase,
    isHost,
    canRevealVotes,
    currentUserVote,
    voteResults,
    // NEW: Get the new properties and handlers from the hook
    deck,
    handleSetDeck,
    handleAssignRevealer,
    // Keep the existing handlers
    handleCardSelect,
    handleRevealVotes,
    handleNewVote,
  } = useGameBoardLogic(gameName, player);

  if (isLoading || !roomState || !player) {
    return <div className="game-board">Cargando sala...</div>;
  }

  // UPDATED: Blur the board if either modal is open
  const boardClassName = `game-board ${isInviteModalOpen || isHostSettingsOpen ? 'blurred' : ''}`;

  return (
    <>
      <div className={boardClassName}>
        <GameBoardHeader
          gameName={roomState.gameName}
          playerName={player.name}
          onInviteClick={() => setIsInviteModalOpen(true)}
          // NEW: Add props for the host avatar click functionality
          isHost={isHost}
          onAvatarClick={() => setIsHostSettingsOpen(true)}
        />

        <PokerTable
          players={roomState.players}
          currentUserName={player.name}
          gamePhase={gamePhase}
          // UPDATED: Pass the revealerName to the table for UI indicators
          revealerName={roomState.revealerName || roomState.players[0]?.name}
          isHost={isHost}
          // UPDATED: Pass the new handler down
          onAssignRevealer={handleAssignRevealer}
          onRevealVotes={handleRevealVotes}
          onNewVote={handleNewVote}
        />

        <GameBoardFooter
          // UPDATED: Pass the dynamic deck to the footer
          deck={deck}
          gamePhase={gamePhase}
          onCardSelect={handleCardSelect}
          selectedValue={currentUserVote}
          voteResults={voteResults}
        />
      </div>

      {/* Your existing modal for inviting players - no changes here */}
      <Modal title="Invitar jugadores" isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)}>
        <InvitePlayers gameId={gameName} />
      </Modal>

      {/* NEW: Render our new Host Settings modal */}
      {isHost && isHostSettingsOpen && (
        <HostSettingsModal
          players={roomState.players}
          currentDeck={deck}
          onSaveDeck={handleSetDeck}
          // We need to pass the revealer assignment function and current revealer
          revealerName={roomState.revealerName || roomState.players[0]?.name}
          onAssignRevealer={handleAssignRevealer}
          onClose={() => setIsHostSettingsOpen(false)}
        />
      )}
    </>
  );
};

export default GameBoard;