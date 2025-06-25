// src/components/3-organisms/GameBoard/hooks/useGameBoardLogic.ts
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

// ✅ --- THE FIX IS HERE ---
// By adding `export`, you make this interface available to other files.
export interface Player {
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

// The hook now correctly uses the exported Player type for its 'player' parameter.
export const useGameBoardLogic = (gameName: string, player: Player | null): GameBoardLogic => {
  const [roomState, setRoomState] = useRoomState(gameName);
  const [gamePhase, setGamePhase] = useState<GamePhase>('VOTING');

  useEffect(() => {
    // console.log('Room state was updated:', roomState);
  }, [roomState]);

  // --- DERIVED STATE & NULL CHECKS ---
  const isLoading = !roomState || !player;

  const isHost = !isLoading && roomState.players.length > 0 && roomState.players[0].name === player.name;
  const canRevealVotes = isHost && roomState.players.length >= 2;
  const currentUserInRoom = !isLoading ? roomState.players.find((p) => p.name === player.name) : undefined;
  const currentUserVote = currentUserInRoom?.vote;

  // --- MEMOIZED CALCULATIONS ---
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