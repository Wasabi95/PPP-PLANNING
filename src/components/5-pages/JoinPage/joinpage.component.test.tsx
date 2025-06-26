import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useParams, useNavigate } from 'react-router-dom';

import JoinPage from './join-page.component';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock child components
jest.mock('../../4-templates/AppLayout/app-layout.component', () => ({
  __esModule: true,
  default: jest.fn(({ children }: { children: React.ReactNode }) => <div data-testid="mock-app-layout">{children}</div>),
}));

jest.mock('../../3-organisms/JoinGame/join-game.component', () => ({
  __esModule: true,
  default: jest.fn(({ onJoinSuccess }: { onJoinSuccess: (name: string, role: any) => void }) => (
    <div data-testid="mock-join-game">
      <button onClick={() => onJoinSuccess('New Player', 'player')}>Join Game</button>
    </div>
  )),
}));

const mockUseParams = useParams as jest.Mock;
const mockUseNavigate = useNavigate as jest.Mock;
let mockNavigate = jest.fn();

// Mock Browser APIs
let localStorageMock: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key: string) => localStorageMock[key] || null),
    setItem: jest.fn((key: string, value: string) => { localStorageMock[key] = value; }),
  },
});

let sessionStorageMock: Record<string, string> = {};
Object.defineProperty(window, 'sessionStorage', {
  value: {
    setItem: jest.fn((key: string, value: string) => { sessionStorageMock[key] = value; }),
  },
});

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('JoinPage Component', () => {
  const testGameId = 'test-room-123';

  beforeEach(() => {
    mockUseParams.mockReturnValue({ gameId: testGameId });
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
    localStorageMock = {};
    sessionStorageMock = {};
    (localStorage.setItem as jest.Mock).mockClear();
    (sessionStorage.setItem as jest.Mock).mockClear();
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  test('should successfully join an existing game and navigate', async () => {
    const existingRoom = { gameName: testGameId, players: [{ name: 'Host Player', role: 'player' }] };
    localStorageMock[testGameId] = JSON.stringify(existingRoom);
    
    const user = userEvent.setup();
    render(<JoinPage />);
    await user.click(screen.getByRole('button', { name: /join game/i }));

    const expectedNewState = { ...existingRoom, players: [ ...existingRoom.players, { name: 'New Player', role: 'player' } ] };
    expect(localStorage.setItem).toHaveBeenCalledWith(testGameId, JSON.stringify(expectedNewState));
    expect(sessionStorage.setItem).toHaveBeenCalledWith('activeGameId', testGameId);
    expect(sessionStorage.setItem).toHaveBeenCalledWith('currentUserName', 'New Player');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // ... other tests remain the same
});