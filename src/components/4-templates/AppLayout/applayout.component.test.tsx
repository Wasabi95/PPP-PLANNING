import React from 'react';
import { render, screen } from '@testing-library/react';
import AppLayout from './app-layout.component';

// Mock the SCSS import to prevent Jest from trying to process it.
// This is a standard practice when testing components with style imports.
// You might need to configure this globally in your jest.setup.js file.
jest.mock('./app-layout.component.scss', () => ({}));

describe('AppLayout', () => {
  it('should render its children correctly', () => {
    // Arrange: Define some child content to render inside the layout.
    const childText = 'This is the page content';
    const ChildComponent = () => <div>{childText}</div>;

    // Act: Render the AppLayout with the child component.
    render(
      <AppLayout>
        <ChildComponent />
      </AppLayout>
    );

    // Assert: Check that the child content is visible on the screen.
    // If the child is rendered, it implicitly proves the AppLayout component is working.
    const childElement = screen.getByText(childText);
    expect(childElement).toBeInTheDocument();
  });

  it('should wrap children in a div with the correct class name', () => {
    // This is a more specific test for the "contract" of the component.
    const childTestId = 'my-child';
    render(
      <AppLayout>
        <div data-testid={childTestId}>Child</div>
      </AppLayout>
    );

    const childElement = screen.getByTestId(childTestId);
    
    // Check that the parent of our child element is the layout div.
    expect(childElement.parentElement).toHaveClass('app-layout');
  });
});