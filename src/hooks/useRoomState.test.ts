import { renderHook, act, fireEvent } from '@testing-library/react';
import { useRoomState, type RoomState } from './useRoomState';
// You might need to adjust the path to your type definition
import { type PlayerRole } from '../components/2-molecules/JoinGameForm/join-game-form.component';

// --- Mocks Setup ---

// 1. Mock localStorage since it's a browser API not available in Jest's Node.js environment.
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// 2. Mock window.dispatchEvent to verify our manual event dispatching works.
Object.defineProperty(window, 'dispatchEvent', { value: jest.fn() });

// 3. Spy on console.error to check for intentional error logging without cluttering the test output.
let consoleErrorSpy: jest.SpyInstance;

// --- Test Suite ---

describe('useRoomState', () => {
  const roomId = 'test-room-123';
  const sampleState: RoomState = {
    gameName: 'Planning Poker',
    players: [{ name: 'Test Player', role: 'player' as PlayerRole, vote: 8 }],
  };

  // Before each test, clear all mock history to ensure test isolation.
  beforeEach(() => {
    localStorageMock.clear();
    (localStorageMock.getItem as jest.Mock).mockClear();
    (localStorageMock.setItem as jest.Mock).mockClear();
    (window.dispatchEvent as jest.Mock).mockClear();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // After each test, restore the original console.error.
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // --- Test Cases ---

  describe('Initialization', () => {
    it('should return null state if no roomId is provided', () => {
      const { result } = renderHook(() => useRoomState(null));
      expect(result.current[0]).toBeNull();
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
    });

    it('should return null state if localStorage is empty for the given roomId', () => {
      const { result } = renderHook(() => useRoomState(roomId));
      expect(result.current[0]).toBeNull();
      expect(localStorageMock.getItem).toHaveBeenCalledWith(roomId);
    });

    it('should initialize state from localStorage if valid data exists', () => {
      localStorageMock.setItem(roomId, JSON.stringify(sampleState));
      const { result } = renderHook(() => useRoomState(roomId));
      expect(result.current[0]).toEqual(sampleState);
    });

    it('should return null and log an error if localStorage contains invalid JSON', () => {
      localStorageMock.setItem(roomId, 'this-is-not-json');
      const { result } = renderHook(() => useRoomState(roomId));
      expect(result.current[0]).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to parse state from localStorage',
        expect.any(Error)
      );
    });
  });

  describe('State Updates', () => {
    it('should update state, save to localStorage, and dispatch an event when updater is called', () => {
      const { result } = renderHook(() => useRoomState(roomId));
      const newState: RoomState = {
        gameName: 'Updated Game',
        players: [],
      };

      // `act` ensures that all state updates are processed before assertions are made.
      act(() => {
        const updateState = result.current[1];
        updateState(newState);
      });

      // Assert the hook's returned state is updated
      expect(result.current[0]).toEqual(newState);
      // Assert the new state was saved to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(roomId, JSON.stringify(newState));
      // Assert the custom event was dispatched for the current tab
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'storage', key: roomId })
      );
    });
  });

  describe('Cross-Tab Synchronization (Storage Event)', () => {
    it('should update state when a storage event for the same room occurs', () => {
      // Start with an empty state
      const { result } = renderHook(() => useRoomState(roomId));
      expect(result.current[0]).toBeNull();

      // Simulate another tab updating localStorage
      localStorageMock.setItem(roomId, JSON.stringify(sampleState));

      // **THE FIX**: Manually create and dispatch the StorageEvent
      const storageEvent = new StorageEvent('storage', {
        key: roomId,
        newValue: JSON.stringify(sampleState),
      });
      fireEvent(window, storageEvent);

      // Assert that the hook reacted to the event and updated its state
      expect(result.current[0]).toEqual(sampleState);
    });

    it('should NOT update state for a storage event with a different key', () => {
      const { result } = renderHook(() => useRoomState(roomId));
      expect(result.current[0]).toBeNull();

      // Simulate an event for a different room
      const storageEvent = new StorageEvent('storage', {
        key: 'some-other-room',
        newValue: '{}',
      });
      fireEvent(window, storageEvent);

      // Assert that the hook ignored the event
      expect(result.current[0]).toBeNull();
    });
  });

  describe('Effect Cleanup', () => {
    it('should add and remove the storage event listener correctly', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useRoomState(roomId));

      // Check that the listener was added on mount
      expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

      // Unmount the component
      unmount();

      // Check that the listener was removed on unmount to prevent memory leaks
      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});