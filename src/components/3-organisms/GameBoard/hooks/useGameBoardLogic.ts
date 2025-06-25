// src/components/3-organisms/GameBoard/hooks/useGameBoardLogic.ts
import { useState, useMemo, useEffect } from 'react';
import {
  useRoomState,
  type CardValue,
  type RoomState,
} from '../../../../hooks/useRoomState';
import { type PlayerRole } from '../../../2-molecules/JoinGameForm/join-game-form.component';

// Types can be moved to a shared types file, e.g., 'src/types/game.ts'
export type GamePhase = 'VOTING' | 'REVEALING' | 'REVEALED';

interface Player {
  name: string;
  role: PlayerRole;
  vote?: CardValue;
}

// The hook's return type
interface GameBoardLogic {
  isLoading: boolean;
  roomState: RoomState | null;
  gamePhase: GamePhase;
  isHost: boolean;
  canRevealVotes: boolean;
  currentUserVote?: CardValue;
  voteResults: { voteCounts: Record<string, number>; average: string };
  handleCardSelect: (value: CardValue) => void;
  handleRevealVotes: () => void;
  handleNewVote: () => void;
}

export const useGameBoardLogic = (gameName: string, player: Player | null): GameBoardLogic => {
  const [roomState, setRoomState] = useRoomState(gameName);
  const [gamePhase, setGamePhase] = useState<GamePhase>('VOTING');

  useEffect(() => {
    // console.log('Room state was updated:', roomState);
  }, [roomState]);

  // --- DERIVED STATE & NULL CHECKS ---
  // The primary loading check. If this is true, the rest of the logic can't run safely.
  const isLoading = !roomState || !player;

  // These values depend on `roomState` and `player`, so we guard them with the `isLoading` check.
  const isHost = !isLoading && roomState.players.length > 0 && roomState.players[0].name === player.name;
  const canRevealVotes = isHost && roomState.players.length >= 2;
  const currentUserInRoom = !isLoading ? roomState.players.find((p) => p.name === player.name) : undefined;
  const currentUserVote = currentUserInRoom?.vote;

  // --- MEMOIZED CALCULATIONS ---
  const voteResults = useMemo(() => {
    // We can also use `isLoading` here for a cleaner check.
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
    // Add `isLoading` to dependency array to ensure recalculation when loading state changes.
  }, [gamePhase, roomState, isLoading]);

  // --- HANDLERS ---
  const handleCardSelect = (value: CardValue) => {
    // Guard clause at the beginning of each handler.
    if (isLoading) return;
    const updatedPlayers = roomState.players.map((p) =>
      p.name === player.name ? { ...p, vote: value } : p
    );
    setRoomState({ ...roomState, players: updatedPlayers });
  };

  const handleRevealVotes = () => {
    // No need for a guard here, as the button to call this is only rendered if not loading.
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

  return {
    isLoading,
    roomState,
    gamePhase,
    isHost,
    canRevealVotes,
    currentUserVote,
    voteResults,
    handleCardSelect,
    handleRevealVotes,
    handleNewVote,
  };
};