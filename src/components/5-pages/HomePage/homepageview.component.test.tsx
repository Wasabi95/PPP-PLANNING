// FIX: Removed 'React' and 'act' as they were unused.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import HomePage from './home-page.component';
import { useRoomState } from '../../../hooks/useRoomState';

// Mock all child components
jest.mock('../../3-organisms/SplashScreen/splash-screen.component', () => ({
  __esModule: true,
  default: jest.fn(({ onFinished }: { onFinished: () => void }) => (
    <div data-testid="mock-splash-screen">
      <button onClick={onFinished}>Finish Splash</button>
    </div>
  )),
}));

jest.mock('../../3-organisms/MainContent/main-content.component', () => ({
  __esModule: true,
  default: jest.fn(({ onGameCreated }: { onGameCreated: (name: string) => void }) => (
    <div data-testid="mock-main-content">
      <button onClick={() => onGameCreated('new-game-123')}>Create Game</button>
    </div>
  )),
}));

jest.mock('../../3-organisms/JoinGame/join-game.component', () => ({
  __esModule: true,
  default: jest.fn(({ onJoinSuccess }: { onJoinSuccess: (name: string, role: any) => void }) => (
    <div data-testid="mock-join-game">
      <button onClick={() => onJoinSuccess('Creator', 'player')}>Join as Creator</button>
    </div>
  )),
}));

jest.mock('../../3-organisms/GameBoard/game-board.component', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-game-board" />),
}));

// Mock the custom hook
jest.mock('../../../hooks/useRoomState');
const mockUseRoomState = useRoomState as jest.Mock;


// Mock Browser APIs
let localStorageMock: Record<string, string> = {};
let sessionStorageMock: Record<string, string> = {};

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key: string) => localStorageMock[key] || null),
    setItem: jest.fn((key: string, value: string) => { localStorageMock[key] = value; }),
    removeItem: jest.fn((key: string) => { delete localStorageMock[key]; }),
    clear: jest.fn(() => { localStorageMock = {}; }),
  },
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn((key: string) => sessionStorageMock[key] || null),
    setItem: jest.fn((key: string, value: string) => { sessionStorageMock[key] = value; }),
    removeItem: jest.fn((key: string) => { delete sessionStorageMock[key]; }),
    clear: jest.fn(() => { sessionStorageMock = {}; }),
  },
});

// Mock window.location with the 'as any' fix
const originalLocation = window.location;
delete (window as any).location;
window.location = { ...originalLocation, href: '' } as any;


describe('HomePage Component', () => {

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockUseRoomState.mockClear();
    window.location.href = ''; 
    (localStorage.setItem as jest.Mock).mockClear();
    (localStorage.removeItem as jest.Mock).mockClear();
    (sessionStorage.setItem as jest.Mock).mockClear();
  });

  test('should initially render the SplashScreen', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-splash-screen')).toBeInTheDocument();
  });

  test('should render MainContent after the splash screen finishes', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    await user.click(screen.getByRole('button', { name: /finish splash/i }));
    expect(screen.queryByTestId('mock-splash-screen')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-main-content')).toBeInTheDocument();
  });

  test('should show JoinGame form after a game is created', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    await user.click(screen.getByRole('button', { name: /finish splash/i }));
    await user.click(screen.getByRole('button', { name: /create game/i }));
    expect(screen.queryByTestId('mock-main-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-join-game')).toBeInTheDocument();
    expect(localStorage.removeItem).toHaveBeenCalledWith('new-game-123');
  });

  test('should save state and navigate when the creator joins the game', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    await user.click(screen.getByRole('button', { name: /finish splash/i }));
    await user.click(screen.getByRole('button', { name: /create game/i }));
    await user.click(screen.getByRole('button', { name: /join as creator/i }));
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'new-game-123',
      JSON.stringify({ gameName: 'new-game-123', players: [{ name: 'Creator', role: 'player' }] })
    );
    expect(sessionStorage.setItem).toHaveBeenCalledWith('activeGameId', 'new-game-123');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('currentUserName', 'Creator');
    expect(window.location.href).toBe('/');
  });

  test('should render the GameBoard if an activeGameId exists in sessionStorage', async () => {
    sessionStorage.setItem('activeGameId', 'active-game-id');
    sessionStorage.setItem('currentUserName', 'Returning User');
    mockUseRoomState.mockReturnValue([
      { 
        gameName: 'active-game-id', 
        players: [{ name: 'Returning User', role: 'player' }],
      }
    ]);

    render(<HomePage />);
    await userEvent.click(screen.getByRole('button', { name: /finish splash/i }));

    expect(screen.getByTestId('mock-game-board')).toBeInTheDocument();
  });

  test('GameBoardProxy should show a loading state initially', async () => {
    sessionStorage.setItem('activeGameId', 'active-game-id');
    mockUseRoomState.mockReturnValue([null]);
    render(<HomePage />);
    await userEvent.click(screen.getByRole('button', { name: /finish splash/i }));
    expect(screen.getByText(/loading game board/i)).toBeInTheDocument();
  });
});