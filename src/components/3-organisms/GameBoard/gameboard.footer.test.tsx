// src/components/3-organisms/GameBoard/gameboard.footer.test.tsx

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import GameBoardFooter from './GameBoardFooter';
import CardDeck from '../../2-molecules/CardDeck/card-deck.component';
import VoteResults from '../../2-molecules/VoteResults/vote-results.component';

// --- DEFINITIVE FIX: Use the correct pattern for mocking ES Modules with default exports ---
jest.mock('../../2-molecules/CardDeck/card-deck.component', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-card-deck" />),
}));

jest.mock('../../2-molecules/VoteResults/vote-results.component', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-vote-results" />),
}));
// --- END FIX ---

// Create typed references to the mocks (this part remains the same)
const MockedCardDeck = CardDeck as jest.Mock;
const MockedVoteResults = VoteResults as jest.Mock;

describe('GameBoardFooter Component', () => {
  const mockOnCardSelect = jest.fn();
  const mockVoteResults = {
    voteCounts: { '5': 2, '8': 1 },
    average: '6.0',
  };

  beforeEach(() => {
    MockedCardDeck.mockClear();
    MockedVoteResults.mockClear();
    mockOnCardSelect.mockClear();
  });

  describe("when gamePhase is 'VOTING'", () => {
    test('should render CardDeck and not VoteResults', () => {
      render(
        <GameBoardFooter
          gamePhase="VOTING"
          onCardSelect={mockOnCardSelect}
          selectedValue={5}
          voteResults={mockVoteResults}
        />
      );
      expect(screen.getByTestId('mock-card-deck')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-vote-results')).not.toBeInTheDocument();
    });

    test('should pass correct props to CardDeck', () => {
      render(
        <GameBoardFooter
          gamePhase="VOTING"
          onCardSelect={mockOnCardSelect}
          selectedValue={8}
          voteResults={mockVoteResults}
        />
      );
      expect(MockedCardDeck).toHaveBeenCalledTimes(1);
      // This assertion will now work correctly
      expect(MockedCardDeck).toHaveBeenCalledWith(
        {
          onCardSelect: mockOnCardSelect,
          selectedValue: 8,
        },
        {} // This second argument is context, and can often be empty
      );
    });
  });

  describe("when gamePhase is 'REVEALED'", () => {
    test('should render VoteResults and not CardDeck', () => {
      render(
        <GameBoardFooter
          gamePhase="REVEALED"
          onCardSelect={mockOnCardSelect}
          voteResults={mockVoteResults}
        />
      );
      expect(screen.getByTestId('mock-vote-results')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-card-deck')).not.toBeInTheDocument();
    });

    test('should pass correct props to VoteResults', () => {
        render(
            <GameBoardFooter
              gamePhase="REVEALED"
              onCardSelect={mockOnCardSelect}
              voteResults={mockVoteResults}
            />
          );
          expect(MockedVoteResults).toHaveBeenCalledTimes(1);
          // This assertion will also now work correctly
          expect(MockedVoteResults).toHaveBeenCalledWith(
            {
              voteCounts: mockVoteResults.voteCounts,
              average: mockVoteResults.average,
            },
            {}
          );
    });
  });
  
  describe("when gamePhase is neither VOTING nor REVEALED", () => {
    test('should render an empty footer', () => {
      render(
        <GameBoardFooter
          gamePhase="REVEALING"
          onCardSelect={mockOnCardSelect}
          voteResults={mockVoteResults}
        />
      );
      expect(screen.queryByTestId('mock-card-deck')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-vote-results')).not.toBeInTheDocument();
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toBeEmptyDOMElement();
    });
  });
});