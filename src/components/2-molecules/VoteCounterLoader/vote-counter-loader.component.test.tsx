// src/components/2-molecules/VoteCounterLoader/votecounterloader.component.test.tsx

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import VoteCounterLoader from './vote-counter-loader.component';

describe('VoteCounterLoader Component', () => {
  test('should render without crashing and display the correct text', () => {
    // Arrange
    render(<VoteCounterLoader />);

    // Assert: Check that the loading text is visible.
    // We use a regular expression with 'i' to make the check case-insensitive.
    const loadingText = screen.getByText(/contando votoss/i);
    expect(loadingText).toBeInTheDocument();
  });

  test('should have the main container with the correct class', () => {
    // Arrange
    // We get the 'container' property from render to inspect elements by class.
    const { container } = render(<VoteCounterLoader />);

    // Assert: Find the main div and check its class.
    const mainDiv = container.querySelector('.vote-counter-loader');
    expect(mainDiv).toBeInTheDocument();
  });

  test('should render the correct number of dots', () => {
    // Arrange
    const { container } = render(<VoteCounterLoader />);

    // Assert: Find all elements with the dot class and check the count.
    const dots = container.querySelectorAll('.vote-counter-loader__dot');
    expect(dots).toHaveLength(4);
  });
});