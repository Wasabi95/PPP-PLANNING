// src/components/2-molecules/CreateGameForm/creategameform.component.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import CreateGameForm from './create-game-form.component';
import { validateGameName } from '../../../utils/validators';

// --- Mocking the validator ---
// We mock the validator module so we can control its output for our tests.
// This allows us to test the form's reaction to validation results
// without depending on the actual implementation of the validator.
jest.mock('../../../utils/validators');

// We need to cast the mocked function to jest.Mock to get type-safe mock methods like mockReturnValue
const mockValidateGameName = validateGameName as jest.Mock;


describe('CreateGameForm Component', () => {
  let mockOnGameCreated: jest.Mock;

  // beforeEach runs before each test. It's a great place to reset mocks and props.
  beforeEach(() => {
    mockOnGameCreated = jest.fn();
    // Reset any previous mock implementation between tests
    mockValidateGameName.mockClear();
  });

  test('should render the initial form correctly', () => {
    // Arrange
    render(<CreateGameForm onGameCreated={mockOnGameCreated} />);

    // Assert
    // Check for the label and its associated input
    expect(screen.getByLabelText(/nombra la partida/i)).toBeInTheDocument();
    
    // Check that the input is initially empty
    expect(screen.getByLabelText(/nombra la partida/i)).toHaveValue('');

    // Check for the submit button
    expect(screen.getByRole('button', { name: /crear partida/i })).toBeInTheDocument();
    
    // The error message should not be present initially
    expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // A better query if you use role="alert"
    // Or check for a specific class if you don't use role="alert"
    expect(document.querySelector('.create-game-form__error')).not.toBeInTheDocument();
  });

  test('should update input value when user types', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<CreateGameForm onGameCreated={mockOnGameCreated} />);
    const input = screen.getByLabelText(/nombra la partida/i);

    // Act
    await user.type(input, 'My New Game');

    // Assert
    expect(input).toHaveValue('My New Game');
  });

  test('should show a validation error if game name is invalid on submit', async () => {
    // Arrange
    const user = userEvent.setup();
    const errorMessage = 'El nombre es demasiado corto.';
    // Configure our mock to return an error message for this test
    mockValidateGameName.mockReturnValue(errorMessage);

    render(<CreateGameForm onGameCreated={mockOnGameCreated} />);
    const input = screen.getByLabelText(/nombra la partida/i);
    const submitButton = screen.getByRole('button', { name: /crear partida/i });

    // Act
    await user.type(input, 'a');
    await user.click(submitButton);

    // Assert
    // The error message should now be visible
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    
    // The onGameCreated callback should NOT have been called
    expect(mockOnGameCreated).not.toHaveBeenCalled();
  });

  test('should call onGameCreated with the game name if validation is successful', async () => {
    // Arrange
    const user = userEvent.setup();
    const validGameName = 'My Awesome Game';
    // Configure our mock to return null (no error) for this test
    mockValidateGameName.mockReturnValue(null);

    render(<CreateGameForm onGameCreated={mockOnGameCreated} />);
    const input = screen.getByLabelText(/nombra la partida/i);
    const submitButton = screen.getByRole('button', { name: /crear partida/i });

    // Act
    await user.type(input, validGameName);
    await user.click(submitButton);

    // Assert
    // The callback should have been called once with the correct name
    expect(mockOnGameCreated).toHaveBeenCalledTimes(1);
    expect(mockOnGameCreated).toHaveBeenCalledWith(validGameName);
    
    // The error message should not be present
    expect(document.querySelector('.create-game-form__error')).not.toBeInTheDocument();
  });

  test('should clear the error message after a successful submission', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<CreateGameForm onGameCreated={mockOnGameCreated} />);
    const input = screen.getByLabelText(/nombra la partida/i);
    const submitButton = screen.getByRole('button', { name: /crear partida/i });

    // Act (Part 1): Trigger an error
    const errorMessage = 'Invalid name';
    mockValidateGameName.mockReturnValue(errorMessage);
    await user.type(input, 'bad');
    await user.click(submitButton);

    // Assert (Part 1): Error is visible
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(mockOnGameCreated).not.toHaveBeenCalled();

    // Act (Part 2): Correct the input and submit again
    mockValidateGameName.mockReturnValue(null); // Now validation should pass
    await user.clear(input);
    await user.type(input, 'Good Game Name');
    await user.click(submitButton);

    // Assert (Part 2): Error is gone and callback was called
    expect(document.querySelector('.create-game-form__error')).not.toBeInTheDocument();
    expect(mockOnGameCreated).toHaveBeenCalledTimes(1);
    expect(mockOnGameCreated).toHaveBeenCalledWith('Good Game Name');
  });
});