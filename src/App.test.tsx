
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import App from './App';

// --- Step 1: Mock the page components ---
// We replace the actual pages with simple placeholders. This isolates our test
// to only the App's routing logic. We use the `{ __esModule: true, default: ... }`
// pattern because the components use `export default`.

jest.mock('./components/5-pages/HomePage/home-page.component', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-home-page">Home Page</div>,
}));

jest.mock('./components/5-pages/JoinPage/join-page.component', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-join-page">Join Page</div>,
}));

describe('App Routing', () => {

  test('should render the HomePage component for the root ("/") path', () => {
    // Arrange: Render the App component inside a MemoryRouter.
    // We set `initialEntries` to tell the router which URL to start on.
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Assert: Check that the HomePage mock is on the screen.
    expect(screen.getByTestId('mock-home-page')).toBeInTheDocument();
    expect(screen.getByText('Home Page')).toBeInTheDocument();

    // Assert: Crucially, check that the JoinPage mock is NOT on the screen.
    expect(screen.queryByTestId('mock-join-page')).not.toBeInTheDocument();
  });

  test('should render the JoinPage component for a dynamic game ID path', () => {
    // Arrange: Define a dynamic route to test.
    const dynamicRoute = '/some-cool-game-123';
    
    // Render the App, starting at our dynamic route.
    render(
      <MemoryRouter initialEntries={[dynamicRoute]}>
        <App />
      </MemoryRouter>
    );

    // Assert: Check that the JoinPage mock is on the screen.
    expect(screen.getByTestId('mock-join-page')).toBeInTheDocument();
    expect(screen.getByText('Join Page')).toBeInTheDocument();

    // Assert: Crucially, check that the HomePage mock is NOT on the screen.
    expect(screen.queryByTestId('mock-home-page')).not.toBeInTheDocument();
  });

  test('should render the JoinPage for a different dynamic game ID path', () => {
    // Arrange: Use another route to confirm it's truly dynamic.
    const anotherRoute = '/another-game-xyz';

    render(
      <MemoryRouter initialEntries={[anotherRoute]}>
        <App />
      </MemoryRouter>
    );

    // Assert: The JoinPage should still be the one to render.
    expect(screen.getByTestId('mock-join-page')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-home-page')).not.toBeInTheDocument();
  });
});