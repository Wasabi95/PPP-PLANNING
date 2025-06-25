// // // src/components/3-organisms/GameBoard/game-board.component.tsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { type PlayerRole } from '../../2-molecules/JoinGameForm/join-game-form.component';
// import PragmaLogo from '../../2-molecules/PragmaLogo/pragma-logo.component';
// import PlayerSeat from '../../2-molecules/PlayerSeat/player-seat.component';
// import Avatar from '../../1-atoms/Avatar/avatar.component';
// import Button from '../../1-atoms/Button/button.component';
// import Modal from '../Modal/modal.component';
// import InvitePlayers from '../../2-molecules/InvitePlayers/invite-players.component';
// import CardDeck from '../../2-molecules/CardDeck/card-deck.component';
// import VoteCounterLoader from '../../2-molecules/VoteCounterLoader/vote-counter-loader.component';
// import VoteResults from '../../2-molecules/VoteResults/vote-results.component';
// import {
//   useRoomState,
//   type CardValue,
//   type RoomState,
// } from '../../../hooks/useRoomState';
// import './game-board.component.scss';

// // --- TYPE AND INTERFACE DEFINITIONS ---

// interface Player {
//   name: string;
//   role: PlayerRole;
//   vote?: CardValue;
// }

// interface GameBoardProps {
//   player: Player | null;
//   gameName: string;
// }

// // ✅ The GamePhase type is defined here at the top level
// type GamePhase = 'VOTING' | 'REVEALING' | 'REVEALED';

// const getInitials = (name: string): string => {
//   if (!name || typeof name !== 'string') return '';
//   const names = name.trim().toUpperCase().split(' ');
//   if (names.length === 1) return names[0].slice(0, 2);
//   return names[0][0] + names[1][0];
// };

// const SEAT_POSITIONS = [
//   { x: -140, y: -155 }, { x: 0, y: -155 }, { x: 120, y: -155 },
//   { x: 330, y: 30 }, { x: -330, y: 30 },
//   { x: 130, y: 160 }, { x: -140, y: 160 },
// ];

// const GameBoard: React.FC<GameBoardProps> = ({ player, gameName }) => {
//   // --- STATE AND HOOKS ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [roomState, setRoomState] = useRoomState(gameName);
//   const [gamePhase, setGamePhase] = useState<GamePhase>('VOTING');
  

//   // ✅ The useEffect hook is correctly placed inside the component
//   useEffect(() => {
//     // This is useful for checking the state if you need to debug again
//     // console.log('Room state was updated:', roomState);
//   }, [roomState]);


//   // --- MEMOIZED CALCULATIONS ---
//   const voteResults = useMemo(() => {
//     if (gamePhase !== 'REVEALED' || !roomState) {
//       return { voteCounts: {}, average: '0,0' };
//     }
//     const numericVotes: number[] = [];
//     const voteCounts = roomState.players.reduce((acc, p) => {
//       if (p.vote !== undefined) {
//         const key = String(p.vote);
//         acc[key] = (acc[key] || 0) + 1;
//         const numericValue = parseInt(String(p.vote), 10);
//         if (!isNaN(numericValue)) {
//           numericVotes.push(numericValue);
//         }
//       }
//       return acc;
//     }, {} as Record<string, number>);
//     const average =
//       numericVotes.length > 0
//         ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
//         : '0.0';
//     return { voteCounts, average: average.replace('.', ',') };
//   }, [gamePhase, roomState]);


//   // --- HANDLER FUNCTIONS ---
//   const handleCardSelect = (value: CardValue) => {
//     if (!roomState || !player) return;
//     const updatedPlayers = roomState.players.map((p) =>
//       p.name === player.name ? { ...p, vote: value } : p
//     );
//     const updatedRoom: RoomState = { ...roomState, players: updatedPlayers };
//     setRoomState(updatedRoom);
//   };

//   const handleRevealVotes = () => {
//     setGamePhase('REVEALING');
//     setTimeout(() => {
//       setGamePhase('REVEALED');
//     }, 2000);
//   };

//   const handleNewVote = () => {
//     if (!roomState) return;    
   
//     const playersWithClearedVotes = roomState.players.map((p) => ({
//       name: p.name,
//       role: p.role,
//     }));

//     const updatedRoom: RoomState = {
//       ...roomState,
//       players: playersWithClearedVotes,
//     };
    
//     setRoomState(updatedRoom);
//     setGamePhase('VOTING');
//   };


//   // --- RENDER LOGIC ---
//   if (!roomState || !player) {
//     return <div className="game-board">Cargando sala...</div>;
//   }

//   const isHost = player && roomState.players.length > 0 && roomState.players[0].name === player.name;
//   const canRevealVotes = isHost && roomState.players.length >= 2;
//   const currentUser = player;
//   const currentUserInRoom = roomState.players.find((p) => p.name === currentUser.name);
//   const currentUserVote = currentUserInRoom?.vote;
//   const boardClassName = `game-board ${isModalOpen ? 'blurred' : ''}`;

//   return (
//     <>
//       <div className={boardClassName}>
//         <header className="game-board__header">
//           <PragmaLogo showText={false} iconSize={48} />
//           <h1 className="game-board__title">{roomState.gameName}</h1>
//           <div className="game-board__header-right">
//             <Avatar initials={getInitials(currentUser.name)} />
//             <Button onClick={() => setIsModalOpen(true)}>
//               Invitar jugadores
//             </Button>
//           </div>
//         </header>

//         <main className="game-board__main-content">
//           <div className="game-board__poker-table">
//             {gamePhase === 'VOTING' && canRevealVotes && (
//               <Button variant="cta" onClick={handleRevealVotes}>
//                 Revelar cartas
//               </Button>
//             )}
//             {gamePhase === 'REVEALING' && <VoteCounterLoader />}
//             {gamePhase === 'REVEALED' && isHost && (
//               <Button variant="cta" onClick={handleNewVote}>
//                 Nueva Votación
//               </Button>
//             )}
//           </div>

//           {(() => {
//             const currentUserData = roomState.players.find(p => p.name === currentUser.name);
//             const otherPlayers = roomState.players.filter(p => p.name !== currentUser.name);

//             return (
//               <>
//                 {currentUserData && (
//                   <div key={currentUserData.name} className="player-seat-wrapper player-seat-wrapper--current-user">
//                     <PlayerSeat
//                       name={currentUserData.name}
//                       initials={getInitials(currentUserData.name)}
//                       isCurrentUser={true}
//                       hasVoted={!!currentUserData.vote}
//                       vote={currentUserData.vote}
//                       phase={gamePhase}
//                     />
//                   </div>
//                 )}
//                 {otherPlayers.map((p, index) => {
//                   const position = SEAT_POSITIONS[index];
//                   if (!position) return null;
//                   const { x, y } = position;
//                   return (
//                     <div key={p.name} className="player-seat-wrapper" style={{ '--x': `${x}px`, '--y': `${y}px` } as React.CSSProperties}>
//                       <PlayerSeat
//                         name={p.name}
//                         initials={getInitials(p.name)}
//                         isCurrentUser={false}
//                         hasVoted={!!p.vote}
//                         vote={p.vote}
//                         phase={gamePhase}
//                       />
//                     </div>
//                   );
//                 })}
//               </>
//             );
//           })()}
//         </main>

//         <footer className="game-board__footer">
//           {gamePhase === 'VOTING' && (
//             <CardDeck
//               onCardSelect={handleCardSelect}
//               selectedValue={currentUserVote}
//             />
//           )}
//           {gamePhase === 'REVEALED' && (
//             <VoteResults
//               voteCounts={voteResults.voteCounts}
//               average={voteResults.average}
//             />
//           )}
//         </footer>
//       </div>

//       <Modal title="Invitar jugadores" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <InvitePlayers gameId={gameName} />
//       </Modal>
//     </>
//   );
// };

// export default GameBoard;

