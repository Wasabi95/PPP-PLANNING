import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import GameBoardHeader from './GameBoardHeader';

// --- Step 1: Mock all child components with default exports ---
// We need to return an object with `{ __esModule: true, default: ... }`

jest.mock('../../2-molecules/PragmaLogo/pragma-logo.component', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-pragma-logo" />),
}));

// This mock captures the 'initials' prop so we can assert it's correct
jest.mock('../../1-atoms/Avatar/avatar.component', () => ({
  __esModule: true,
  default: jest.fn(({ initials }: { initials: string }) => (
    <div data-testid="mock-avatar" data-initials={initials}></div>
  )),
}));

// This mock renders a real button so userEvent can click it
jest.mock('../../1-atoms/Button/button.component', () => ({
  __esModule: true,
  default: jest.fn(({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
    <button onClick={onClick}>{children}</button>
  )),
}));

describe('GameBoardHeader Component', () => {

  // --- Step 2: Set up base props ---
  const mockGameName = 'Planning Poker Game';
  const mockPlayerName = 'John Doe';
  const mockOnInviteClick = jest.fn();

  beforeEach(() => {
    // Clear mock history before each test
    mockOnInviteClick.mockClear();
  });

  test('should render all elements correctly with given props', () => {
    // Arrange
    render(
      <GameBoardHeader
        gameName={mockGameName}
        playerName={mockPlayerName}
        onInviteClick={mockOnInviteClick}
      />
    );

    // Assert
    // Check that the mocked children are rendered
    expect(screen.getByTestId('mock-pragma-logo')).toBeInTheDocument();
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();

    // Check that the title is rendered with the correct text
    expect(screen.getByRole('heading', { name: mockGameName })).toBeInTheDocument();

    // Check that the button is rendered with the correct text
    expect(screen.getByRole('button', { name: /invitar jugadores/i })).toBeInTheDocument();
  });

  test('should call onInviteClick when the invite button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <GameBoardHeader
        gameName={mockGameName}
        playerName={mockPlayerName}
        onInviteClick={mockOnInviteClick}
      />
    );
    const inviteButton = screen.getByRole('button', { name: /invitar jugadores/i });

    // Act
    await user.click(inviteButton);

    // Assert
    expect(mockOnInviteClick).toHaveBeenCalledTimes(1);
  });

  // --- Step 3: Test the internal getInitials logic via component output ---
  // Using test.each is a clean way to test multiple scenarios.
  describe('initials calculation', () => {
    test.each([
      { name: 'John Doe', expected: 'JD' },
      { name: 'Single', expected: 'SI' },
      { name: '  leading space', expected: 'LS' },
      { name: 'trailing space  ', expected: 'TS' },
      { name: 'lowercase letters', expected: 'LL' },
      { name: 'Three Word Name', expected: 'TW' },
      { name: '', expected: '' },
    ])('should calculate initials "$expected" for player name "$name"', ({ name, expected }) => {
      // Arrange
      render(
        <GameBoardHeader
          gameName="Test Game"
          playerName={name}
          onInviteClick={jest.fn()}
        />
      );

      // Act
      const avatar = screen.getByTestId('mock-avatar');

      // Assert
      expect(avatar).toHaveAttribute('data-initials', expected);
    });
  });
});