//src/components/2-molecules/PlayerSeat/playerseat.component.test.tsx

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import PlayerSeat from './player-seat.component';
import { type CardValue } from '../../../hooks/useRoomState';

// --- Mocking Child Components ---
// We mock the Avatar component to isolate the PlayerSeat's logic.
// The mock will render a simple div with a test-id and data attributes
// representing the props it received. This allows us to verify that
// PlayerSeat passes the correct props down to its children.
jest.mock('../../1-atoms/Avatar/avatar.component', () => {
  return jest.fn(({ initials, hasVoted }) => (
    <div
      data-testid="mock-avatar"
      data-initials={initials}
      data-has-voted={String(hasVoted)} // Convert boolean to string for attribute
    ></div>
  ));
});

// To make testing the placeholder easier, you could add a test-id to it in the component:
// <div data-testid="card-placeholder" className={`card-placeholder ...`}> ... </div>
// The tests below assume this test-id has been added.

describe('PlayerSeat Component', () => {
  // Define base props to reduce repetition in tests
  const baseProps = {
    name: 'Test Player',
    initials: 'TP',
    isCurrentUser: false,
    hasVoted: false,
    vote: undefined as CardValue | undefined,
    phase: 'VOTING' as const,
  };

  test('should always render the player name', () => {
    render(<PlayerSeat {...baseProps} />);
    expect(screen.getByText('Test Player')).toBeInTheDocument();
  });

  // --- Test Suite for REVEALED Phase (Highest Priority Logic) ---
  describe("when phase is 'REVEALED'", () => {
    test('should render the revealed vote if a vote is present', () => {
      render(
        <PlayerSeat {...baseProps} phase="REVEALED" vote={8} hasVoted={true} />
      );

      // Assert: The vote value is visible
      const revealedVote = screen.getByText('8');
      expect(revealedVote).toBeInTheDocument();
      expect(revealedVote.parentElement).toHaveClass('player-seat__revealed-card');

      // Assert: Other elements are NOT rendered
      expect(screen.queryByTestId('mock-avatar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('card-placeholder')).not.toBeInTheDocument();
    });

    test('should fall back to placeholder/avatar if phase is REVEALED but vote is undefined', () => {
      // This is an edge case: the phase is revealed, but this player's vote isn't available.
      // It should behave as if it's the VOTING phase.
      render(<PlayerSeat {...baseProps} phase="REVEALED" vote={undefined} />);
      
      // It's not the current user, so it should show the placeholder.
      expect(screen.getByTestId('card-placeholder')).toBeInTheDocument();
      expect(screen.queryByText('8')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-avatar')).not.toBeInTheDocument();
    });
  });

  // --- Test Suite for Current User's View ---
  describe("when it's the current user (and not revealed)", () => {
    test('should render the Avatar with correct props when user has NOT voted', () => {
      render(<PlayerSeat {...baseProps} isCurrentUser={true} phase="VOTING" />);

      const avatar = screen.getByTestId('mock-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('data-initials', baseProps.initials);
      expect(avatar).toHaveAttribute('data-has-voted', 'false');

      // Assert: Main wrapper has the correct class
      expect(screen.getByText(baseProps.name).parentElement).toHaveClass('is-current-user');
      
      // Assert: Other elements are NOT rendered
      expect(screen.queryByTestId('card-placeholder')).not.toBeInTheDocument();
    });

    test('should render the Avatar with hasVoted=true when user HAS voted', () => {
      render(
        <PlayerSeat
          {...baseProps}
          isCurrentUser={true}
          hasVoted={true}
          phase="VOTING"
        />
      );

      const avatar = screen.getByTestId('mock-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('data-has-voted', 'true');
    });
  });

  // --- Test Suite for Other Players' View ---
  describe("when it's another player (and not revealed)", () => {
    test('should render a non-voted placeholder when the player has NOT voted', () => {
      render(<PlayerSeat {...baseProps} isCurrentUser={false} phase="VOTING" />);

      const placeholder = screen.getByTestId('card-placeholder');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).not.toHaveClass('card-placeholder--voted');
      
      // Assert: Other elements are NOT rendered
      expect(screen.queryByTestId('mock-avatar')).not.toBeInTheDocument();
    });

    test("should render a 'voted' placeholder when the player HAS voted", () => {
      render(
        <PlayerSeat
          {...baseProps}
          isCurrentUser={false}
          hasVoted={true}
          phase="VOTING"
        />
      );
      
      const placeholder = screen.getByTestId('card-placeholder');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveClass('card-placeholder--voted');
    });
  });
});