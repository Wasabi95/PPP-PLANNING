// src/components/2-molecules/VoteResults/vote-results.component.test.tsx

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import VoteResults from './vote-results.component';
import { type CardValue } from '../../../hooks/useRoomState';

jest.mock('../../1-atoms/VotingCard/voting-card.component', () => {
  return jest.fn(({ value }: { value: CardValue }) => (
    <div data-testid="mock-voting-card">{value}</div>
  ));
});

describe('VoteResults Component', () => {

  test('should render multiple vote counts and the average correctly', () => {
    // Arrange
    const voteCounts = {
      '5': 3,
      '8': 2,
      '☕': 1,
    };
    const average = '6.5';

    render(<VoteResults voteCounts={voteCounts} average={average} />);

    // Assert
    // Check for the average display
    expect(screen.getByText('Promedio:')).toBeInTheDocument();
    expect(screen.getByText('6.5')).toBeInTheDocument();

    // Check that the correct number of cards are rendered
    const renderedCards = screen.getAllByTestId('mock-voting-card');
    expect(renderedCards).toHaveLength(3);
    
    // Check that each card has the correct value
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('☕')).toBeInTheDocument();

    // Check for the vote count text, including pluralization
    expect(screen.getByText('3 Votos')).toBeInTheDocument();
    expect(screen.getByText('2 Votos')).toBeInTheDocument();
    expect(screen.getByText('1 Voto')).toBeInTheDocument(); // Note: singular
  });

  test('should handle an empty voteCounts object gracefully', () => {
    // Arrange
    const voteCounts = {};
    const average = 'N/A'; // Example for when no votes are cast

    render(<VoteResults voteCounts={voteCounts} average={average} />);

    // Assert
    // The average should still be displayed
    expect(screen.getByText('Promedio:')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();

    // No voting cards should be rendered
    const renderedCards = screen.queryAllByTestId('mock-voting-card');
    expect(renderedCards).toHaveLength(0);
  });

  test('should correctly display singular "Voto" for a count of 1', () => {
    // Arrange
    const voteCounts = { '13': 1 };
    const average = '13.0';

    render(<VoteResults voteCounts={voteCounts} average={average} />);

    // Assert
    // Specifically check for the singular form
    expect(screen.getByText('1 Voto')).toBeInTheDocument();
    
    // Assert that the plural form is NOT present
    expect(screen.queryByText('1 Votos')).not.toBeInTheDocument();
  });
  
  test('should correctly display plural "Votos" for a count greater than 1', () => {
    // Arrange
    const voteCounts = { '3': 5 };
    const average = '3.0';

    render(<VoteResults voteCounts={voteCounts} average={average} />);

    // Assert
    // Specifically check for the plural form
    expect(screen.getByText('5 Votos')).toBeInTheDocument();
    
    // Assert that the singular form is NOT present
    expect(screen.queryByText('5 Voto')).not.toBeInTheDocument();
  });
});