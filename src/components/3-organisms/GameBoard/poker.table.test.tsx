import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import PokerTable from './PokerTable';
import { useWindowSize } from './hooks/useWindowSize';
// --- FIX: Import Player type from the local hook's file ---
import { type Player } from './hooks/useGameBoardLogic';

// Mock all dependencies
jest.mock('./hooks/useWindowSize');
const mockUseWindowSize = useWindowSize as jest.Mock;

jest.mock('../../2-molecules/PlayerSeat/player-seat.component', () => ({
  __esModule: true,
  default: jest.fn(({ name }: { name: string }) => (
    <div data-testid="mock-player-seat">{name}</div>
  )),
}));

jest.mock('../../1-atoms/Button/button.component', () => ({
  __esModule: true,
  default: jest.fn(({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick}>{children}</button>
  )),
}));

jest.mock('../../2-molecules/VoteCounterLoader/vote-counter-loader.component', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-vote-loader" />),
}));


describe('PokerTable Component', () => {

  const mockPlayers: Player[] = [
    { name: 'Alice', vote: 5, role: 'player' },
    { name: 'Bob', vote: 8, role: 'player' },
    { name: 'Charlie', role: 'spectator' },
  ];

  const baseProps = {
    players: mockPlayers,
    currentUserName: 'Alice',
    gamePhase: 'VOTING' as const,
    canRevealVotes: false,
    isHost: false,
    onRevealVotes: jest.fn(),
    onNewVote: jest.fn(),
  };

  beforeEach(() => {
    mockUseWindowSize.mockReturnValue({ width: 1024, height: 768 });
    baseProps.onRevealVotes.mockClear();
    baseProps.onNewVote.mockClear();
  });

  describe('Central Area Content', () => {
    test('should render "Revelar cartas" button when phase is VOTING and canRevealVotes is true', () => {
      render(<PokerTable {...baseProps} canRevealVotes={true} />);
      expect(screen.getByRole('button', { name: /revelar cartas/i })).toBeInTheDocument();
    });

    test('should render the loader when phase is REVEALING', () => {
      render(<PokerTable {...baseProps} gamePhase="REVEALING" />);
      expect(screen.getByTestId('mock-vote-loader')).toBeInTheDocument();
    });

    test('should render "Nueva Votación" button when phase is REVEALED and isHost is true', () => {
      render(<PokerTable {...baseProps} gamePhase="REVEALED" isHost={true} />);
      expect(screen.getByRole('button', { name: /nueva votación/i })).toBeInTheDocument();
    });
  });

  describe('Player Rendering', () => {
    test('should render the current user and other players separately', () => {
      render(<PokerTable {...baseProps} />);
      expect(screen.getByText('Alice').parentElement).toHaveClass('player-seat-wrapper--current-user');
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    test('should use DESKTOP positions for wide screens', () => {
      render(<PokerTable {...baseProps} />);
      const bobSeatWrapper = screen.getByText('Bob').parentElement;
      expect(bobSeatWrapper).toHaveStyle('--x: -140px');
      expect(bobSeatWrapper).toHaveStyle('--y: -155px');
    });

    test('should use MOBILE positions for narrow screens', () => {
      mockUseWindowSize.mockReturnValue({ width: 500, height: 800 });
      render(<PokerTable {...baseProps} />);
      const bobSeatWrapper = screen.getByText('Bob').parentElement;
      expect(bobSeatWrapper).toHaveStyle('--x: -130px');
      expect(bobSeatWrapper).toHaveStyle('--y: -80px');
    });
  });
  
  describe('Callbacks', () => {
    test('should call onRevealVotes when "Revelar cartas" is clicked', async () => {
      const user = userEvent.setup();
      render(<PokerTable {...baseProps} canRevealVotes={true} />);
      await user.click(screen.getByRole('button', { name: /revelar cartas/i }));
      expect(baseProps.onRevealVotes).toHaveBeenCalledTimes(1);
    });

    test('should call onNewVote when "Nueva Votación" is clicked', async () => {
        const user = userEvent.setup();
        render(<PokerTable {...baseProps} gamePhase="REVEALED" isHost={true} />);
        await user.click(screen.getByRole('button', { name: /nueva votación/i }));
        expect(baseProps.onNewVote).toHaveBeenCalledTimes(1);
      });
  });
});