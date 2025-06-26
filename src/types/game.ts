// src/types/game.ts

/** Represents a single player in the game room. */
export interface Player {
  id: string; // A unique identifier for the player is crucial
  name: string;
  vote?: string | null; // The player's current vote
  isSpectator?: boolean;
}

/** Represents the entire state of the game room. */
export interface RoomState {
  gameName: string;
  hostId: string; // The unique ID of the current host/owner
  players: Player[];
  cardDeck: string[]; // The array of card values for the current game
}

/** Defines the object returned by the useGameBoardLogic hook. */
export interface GameBoardLogic {
  isLoading: boolean;
  roomState: RoomState | null;
  gamePhase: 'voting' | 'results';
  isHost: boolean;
  canRevealVotes: boolean;
  currentUserVote: string | null;
  voteResults: { value: string; count: number }[];
  handleCardSelect: (cardValue: string) => void;
  handleRevealVotes: () => void;
  handleNewVote: () => void;
  // --- NEW FUNCTIONS TO BE ADDED ---
  handleUpdateDeck: (newDeck: string[]) => void;
  handleAssignOwner: (newOwnerId:string) => void;
}