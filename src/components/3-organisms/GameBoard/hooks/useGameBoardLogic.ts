// // src/components/3-organisms/GameBoard/hooks/useGameBoardLogic.ts
// import { useState, useMemo, useEffect } from 'react';
// import {
//   useRoomState,
//   type CardValue,
//   type RoomState,
// } from '../../../../hooks/useRoomState';
// import { type PlayerRole } from '../../../2-molecules/JoinGameForm/join-game-form.component';


// export type GamePhase = 'VOTING' | 'REVEALING' | 'REVEALED';


// export interface Player {
//   name: string;
//   role: PlayerRole;
//   vote?: CardValue;
// }

// // The hook's return type
// interface GameBoardLogic {
//   isLoading: boolean;
//   roomState: RoomState | null;
//   gamePhase: GamePhase;
//   isHost: boolean;
//   canRevealVotes: boolean;
//   currentUserVote?: CardValue;
//   voteResults: { voteCounts: Record<string, number>; average: string };
//   handleCardSelect: (value: CardValue) => void;
//   handleRevealVotes: () => void;
//   handleNewVote: () => void;
   
// }

// // The hook now correctly uses the exported Player type for its 'player' parameter.
// export const useGameBoardLogic = (gameName: string, player: Player | null): GameBoardLogic => {
//   const [roomState, setRoomState] = useRoomState(gameName);
//   const [gamePhase, setGamePhase] = useState<GamePhase>('VOTING');

//   useEffect(() => {  
//   }, [roomState]);

//   // --- DERIVED STATE & NULL CHECKS ---
//   const isLoading = !roomState || !player;
//   const isHost = !isLoading && roomState.players.length > 0 && roomState.players[0].name === player.name;
//   const canRevealVotes = isHost && roomState.players.length >= 2;
//   const currentUserInRoom = !isLoading ? roomState.players.find((p) => p.name === player.name) : undefined;
//   const currentUserVote = currentUserInRoom?.vote;

//   // --- MEMOIZED CALCULATIONS ---
//   const voteResults = useMemo(() => {
//     if (gamePhase !== 'REVEALED' || isLoading) {
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
//   }, [gamePhase, roomState, isLoading]);

//   // --- HANDLERS ---
//   const handleCardSelect = (value: CardValue) => {
//     if (isLoading) return;
//     const updatedPlayers = roomState.players.map((p) =>
//       p.name === player.name ? { ...p, vote: value } : p
//     );
//     setRoomState({ ...roomState, players: updatedPlayers });
//   };

//   const handleRevealVotes = () => {
//     setGamePhase('REVEALING');
//     setTimeout(() => setGamePhase('REVEALED'), 2000);
//   };

//   const handleNewVote = () => {
//     if (isLoading) return;
//     const playersWithClearedVotes = roomState.players.map((p) => ({
//       name: p.name,
//       role: p.role,
//     }));
//     setRoomState({ ...roomState, players: playersWithClearedVotes });
//     setGamePhase('VOTING');
//   };

//   return {
//     isLoading,
//     roomState,
//     gamePhase,
//     isHost,
//     canRevealVotes,
//     currentUserVote,
//     voteResults,
//     handleCardSelect,
//     handleRevealVotes,
//     handleNewVote,
//   };
// };




// src/components/3-organisms/GameBoard/hooks/useGameBoardLogic.ts
// src/components/3-organisms/GameBoard/hooks/useGameBoardLogic.ts
import { useState, useMemo, useEffect } from 'react';
import {
  useRoomState,
  type CardValue,
  type RoomState,
} from '../../../../hooks/useRoomState';
import { type PlayerRole } from '../../../2-molecules/JoinGameForm/join-game-form.component';


export type GamePhase = 'VOTING' | 'REVEALING' | 'REVEALED';

export interface Player {
  name: string;
  role: PlayerRole;
  vote?: CardValue;
}

// The hook's return type with all new properties
interface GameBoardLogic {
  isLoading: boolean;
  roomState: RoomState | null;
  gamePhase: GamePhase;
  isHost: boolean;
  canRevealVotes: boolean;
  currentUserVote?: CardValue;
  voteResults: { voteCounts: Record<string, number>; average: string };
  deck: CardValue[]; // The current deck to use
  handleCardSelect: (value: CardValue) => void;
  handleRevealVotes: () => void;
  handleNewVote: () => void;
  handleAssignRevealer: (playerName: string) => void;
  handleSetDeck: (newDeck: CardValue[]) => void; // Function to set the deck
}

// CORRECTED: Define the default deck values as a constant at the top level
const DEFAULT_DECK: CardValue[] = [0, 1, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'];

export const useGameBoardLogic = (gameName: string, player: Player | null): GameBoardLogic => {
  // --- STATE and HOOKS ---
  const [roomState, setRoomState] = useRoomState(gameName);
  const [gamePhase, setGamePhase] = useState<GamePhase>('VOTING');

  // --- DERIVED STATE & NULL CHECKS (CORRECTED ORDER) ---
  const isLoading = !roomState || !player;
  const isHost = !isLoading && roomState.players.length > 0 && roomState.players[0].name === player.name;

  // The current deck is either the custom one from roomState or the default
  const deck = useMemo(() => {
    return roomState?.deckValues || DEFAULT_DECK;
  }, [roomState?.deckValues]);

  // Dynamic check for who can reveal votes
  const canRevealVotes = useMemo(() => {
    if (isLoading) return false;
    const designatedRevealerName = roomState.revealerName || roomState.players[0]?.name;
    return player.name === designatedRevealerName && roomState.players.length >= 2;
  }, [isLoading, player, roomState]);

  const currentUserInRoom = !isLoading ? roomState.players.find((p) => p.name === player.name) : undefined;
  const currentUserVote = currentUserInRoom?.vote;


  // --- SIDE EFFECTS ---
  // Effect to handle when the assigned revealer leaves the game
  useEffect(() => {
    if (roomState?.revealerName) {
      const revealerExists = roomState.players.some(
        (p) => p.name === roomState.revealerName
      );
      if (!revealerExists) {
        const { revealerName, ...restOfState } = roomState;
        setRoomState(restOfState);
      }
    }
  }, [roomState, setRoomState]);

  // --- MEMOIZED CALCULATIONS ---
  // (No changes needed in this section)
  const voteResults = useMemo(() => {
    if (gamePhase !== 'REVEALED' || isLoading) {
      return { voteCounts: {}, average: '0,0' };
    }
    const numericVotes: number[] = [];
    const voteCounts = roomState.players.reduce((acc, p) => {
      if (p.vote !== undefined) {
        const key = String(p.vote);
        acc[key] = (acc[key] || 0) + 1;
        const numericValue = parseInt(String(p.vote), 10);
        if (!isNaN(numericValue)) {
          numericVotes.push(numericValue);
        }
      }
      return acc;
    }, {} as Record<string, number>);

    const average =
      numericVotes.length > 0
        ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
        : '0.0';

    return { voteCounts, average: average.replace('.', ',') };
  }, [gamePhase, roomState, isLoading]);


  // --- HANDLERS ---
  const handleCardSelect = (value: CardValue) => {
    if (isLoading) return;
    const updatedPlayers = roomState.players.map((p) =>
      p.name === player.name ? { ...p, vote: value } : p
    );
    setRoomState({ ...roomState, players: updatedPlayers });
  };

  const handleRevealVotes = () => {
    if (!canRevealVotes) return;
    setGamePhase('REVEALING');
    setTimeout(() => setGamePhase('REVEALED'), 2000);
  };

  const handleNewVote = () => {
    if (isLoading) return;
    const playersWithClearedVotes = roomState.players.map((p) => ({
      name: p.name,
      role: p.role,
    }));
    setRoomState({ ...roomState, players: playersWithClearedVotes });
    setGamePhase('VOTING');
  };

  const handleAssignRevealer = (playerName: string) => {
    if (isLoading || !isHost) return;
    setRoomState({ ...roomState, revealerName: playerName });
  };

  // CORRECTED: Handler for the host to set a new deck.
  const handleSetDeck = (newDeck: CardValue[]) => {
    if (isLoading || !isHost) return;
    
    // When the deck changes, it's best to clear all existing votes
    const playersWithClearedVotes = roomState.players.map((p) => ({
      name: p.name,
      role: p.role,
    }));
    
    setRoomState({ ...roomState, deckValues: newDeck, players: playersWithClearedVotes });
  };


  // --- RETURN VALUE ---
  return {
    isLoading,
    roomState,
    gamePhase,
    isHost,
    canRevealVotes,
    currentUserVote,
    voteResults,
    deck, 
    handleCardSelect,
    handleRevealVotes,
    handleNewVote,
    handleAssignRevealer,
    handleSetDeck, 
  };
};