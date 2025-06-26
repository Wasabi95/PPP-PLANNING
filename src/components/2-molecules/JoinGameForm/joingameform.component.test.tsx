// src/components/2-molecules/JoinGameForm/joingameform.component.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import JoinGameForm, { PlayerRole } from './join-game-form.component';
import { validateGameName } from '../../../utils/validators';

// Mock the validator module to isolate the form component's logic.
jest.mock('../../../utils/validators');
const mockValidateGameName = validateGameName as jest.Mock;

describe('JoinGameForm Component', () => {
  let mockOnJoinSuccess: jest.Mock<void, [name: string, role: PlayerRole]>;

  beforeEach(() => {
    // Reset mocks before each test
    mockOnJoinSuccess = jest.fn();
    mockValidateGameName.mockClear();
  });

  test('should render the initial form correctly with default values', () => {
    // Arrange
    render(<JoinGameForm onJoinSuccess={mockOnJoinSuccess} />);

    // Assert
    // Check for the name input
    expect(screen.getByLabelText(/tu nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tu nombre/i)).toHaveValue('');

    // Check that 'Jugador' is the default selected role
    expect(screen.getByRole('radio', { name: /jugador/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /espectador/i })).not.toBeChecked();

    // Check for the submit button
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();

    // Error message should not be visible
    expect(document.querySelector('.join-game-form__error')).not.toBeInTheDocument();
  });

  test('should allow user to type a name and change role', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<JoinGameForm onJoinSuccess={mockOnJoinSuccess} />);

    const nameInput = screen.getByLabelText(/tu nombre/i);
    const playerRadio = screen.getByRole('radio', { name: /jugador/i });
    const spectatorRadio = screen.getByRole('radio', { name: /espectador/i });

    // Act: Type a name
    await user.type(nameInput, 'Test User');
    // Assert: Name is updated
    expect(nameInput).toHaveValue('Test User');

    // Act: Change role to Spectator
    await user.click(spectatorRadio);
    // Assert: Roles are updated
    expect(spectatorRadio).toBeChecked();
    expect(playerRadio).not.toBeChecked();
  });

  test('should display a validation error if the name is invalid on submit', async () => {
    // Arrange
    const user = userEvent.setup();
    const errorMessage = 'El nombre no puede estar vacío.';
    // Configure mock to return an error
    mockValidateGameName.mockReturnValue(errorMessage);

    render(<JoinGameForm onJoinSuccess={mockOnJoinSuccess} />);
    const submitButton = screen.getByRole('button', { name: /continuar/i });

    // Act
    await user.click(submitButton);

    // Assert
    // The validator was called
    expect(mockValidateGameName).toHaveBeenCalledWith('');
    // The error message is now displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    // The success callback was NOT called
    expect(mockOnJoinSuccess).not.toHaveBeenCalled();
  });

  test('should call onJoinSuccess with name and default role ("player") on valid submission', async () => {
    // Arrange
    const user = userEvent.setup();
    const playerName = 'Valid Player';
    // Configure mock to return no error
    mockValidateGameName.mockReturnValue(null);

    render(<JoinGameForm onJoinSuccess={mockOnJoinSuccess} />);
    const nameInput = screen.getByLabelText(/tu nombre/i);
    const submitButton = screen.getByRole('button', { name: /continuar/i });

    // Act
    await user.type(nameInput, playerName);
    await user.click(submitButton);

    // Assert
    // Validator was called with the typed name
    expect(mockValidateGameName).toHaveBeenCalledWith(playerName);
    // Success callback was called with correct data
    expect(mockOnJoinSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnJoinSuccess).toHaveBeenCalledWith(playerName, 'player');
    // Error message is not present
    expect(document.querySelector('.join-game-form__error')).not.toBeInTheDocument();
  });

  test('should call onJoinSuccess with name and selected role ("spectator") on valid submission', async () => {
    // Arrange
    const user = userEvent.setup();
    const playerName = 'Spectator Sam';
    mockValidateGameName.mockReturnValue(null);

    render(<JoinGameForm onJoinSuccess={mockOnJoinSuccess} />);
    const nameInput = screen.getByLabelText(/tu nombre/i);
    const spectatorRadio = screen.getByRole('radio', { name: /espectador/i });
    const submitButton = screen.getByRole('button', { name: /continuar/i });

    // Act
    await user.type(nameInput, playerName);

    await user.click(spectatorRadio); // User selects the other role
    await user.click(submitButton);

    // Assert
    // Success callback was called with the non-default role
    expect(mockOnJoinSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnJoinSuccess).toHaveBeenCalledWith(playerName, 'spectator');
  });

  test('should clear the error message after a subsequent successful submission', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<JoinGameForm onJoinSuccess={mockOnJoinSuccess} />);
    const nameInput = screen.getByLabelText(/tu nombre/i);
    const submitButton = screen.getByRole('button', { name: /continuar/i });

    // Act (Part 1): Trigger an error
    const errorMessage = 'Invalid name!';
    mockValidateGameName.mockReturnValue(errorMessage);
    await user.click(submitButton);

    // Assert (Part 1): Error is visible
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(mockOnJoinSuccess).not.toHaveBeenCalled();

    // Act (Part 2): Correct the input and submit again
    mockValidateGameName.mockReturnValue(null); // Now validation should pass
    await user.type(nameInput, 'Now a valid name');
    await user.click(submitButton);

    // Assert (Part 2): Error is gone and callback was called
    expect(document.querySelector('.join-game-form__error')).not.toBeInTheDocument();
    expect(mockOnJoinSuccess).toHaveBeenCalledWith('Now a valid name', 'player');
  });
});