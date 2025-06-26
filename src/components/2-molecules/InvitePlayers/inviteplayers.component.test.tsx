//src/components/2-molecules/InvitePlayers/inviteplayers.component.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import InvitePlayers from './invite-players.component';

// --- Mocking Setup ---
const mockWriteText = jest.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  configurable: true,
});

// CRITICAL FIX FOR YOUR JEST VERSION:
// Providing an empty object opts into the "modern" fake timers
// without using the 'legacy' key that your types don't recognize.
jest.useFakeTimers({});

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('InvitePlayers Component', () => {
  const mockGameId = 'xyz-789-abc';
  const mockOrigin = 'http://test.app';
  const expectedLink = `${mockOrigin}/${mockGameId}`;

  beforeEach(() => {
    Object.defineProperty(window, 'location', { writable: true });
    window.location = { origin: mockOrigin } as any;
    mockWriteText.mockClear();
    consoleErrorSpy.mockClear();
    jest.clearAllTimers();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    jest.useRealTimers();
  });

  test('should render correctly with the initial invite link and button text', () => {
    render(<InvitePlayers gameId={mockGameId} />);
    expect(screen.getByText(expectedLink)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copiar link/i })).toBeInTheDocument();
  });

  test('should copy the link and update button text on successful click', async () => {
    // Arrange
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockWriteText.mockResolvedValue(undefined);

    render(<InvitePlayers gameId={mockGameId} />);
    const copyButton = screen.getByRole('button', { name: /copiar link/i });

    // Act
    await user.click(copyButton);

    // Assert
    expect(mockWriteText).toHaveBeenCalledTimes(1);
    expect(mockWriteText).toHaveBeenCalledWith(expectedLink);
    expect(await screen.findByRole('button', { name: /copiado!/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /copiar link/i })).toBeInTheDocument();
  });

  test('should show an error message on the button if copying fails', async () => {
    // Arrange
    const user = userEvent.setup();
    const copyError = new Error('Copy failed!');
    mockWriteText.mockRejectedValue(copyError);

    render(<InvitePlayers gameId={mockGameId} />);
    const copyButton = screen.getByRole('button', { name: /copiar link/i });

    // Act
    await user.click(copyButton);

    // Assert
    expect(await screen.findByRole('button', { name: /error al copiar/i })).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy: ', copyError);
  });
});