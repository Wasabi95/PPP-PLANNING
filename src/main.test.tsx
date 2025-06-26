
import { createRoot } from 'react-dom/client';

// --- Step 1: Mock the dependencies ---

// 1a: Mock the entire 'react-dom/client' module
jest.mock('react-dom/client', () => ({
  // The module has a `createRoot` property, which is a function.
  createRoot: jest.fn(),
}));

// 1b: Mock the main App component to prevent it from rendering.
jest.mock('./App', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-app" />,
}));


// --- Step 2: Create a typed reference to the mocked function ---
// This gives us type safety and autocompletion on our mock.
const mockCreateRoot = createRoot as jest.Mock;

describe('Application Root (main.tsx)', () => {

  // A variable to hold the mock render function, which we'll create for each test.
  let mockRender: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    mockRender = jest.fn();
    // Set up the mock return value for createRoot for this test run.
    // It returns an object with a `render` method, which is our spy.
    mockCreateRoot.mockReturnValue({
      render: mockRender,
    });
  });

  afterEach(() => {
    // Clean up mocks after each test
    mockCreateRoot.mockClear();
  });


  test('should render the App into the root element successfully', () => {
    // Arrange: Create the #root element in the DOM for this test
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    // Act: Execute the main.tsx script.
    // We use jest.isolateModules to ensure it's a fresh run.
    jest.isolateModules(() => {
      require('./main.tsx');
    });

    // Assert: Check that createRoot was called correctly
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement);

    // Assert: Check that root.render was called correctly
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Assert: Use a snapshot to verify the entire rendered tree.
    // This is the best way to check that StrictMode and BrowserRouter are wrapping the App.
    expect(mockRender.mock.calls[0][0]).toMatchSnapshot();
    
    // Cleanup the DOM
    document.body.removeChild(rootElement);
  });


  test('should throw an error if the root element is not found', () => {
    // Arrange: Ensure the #root element does NOT exist.
    document.body.innerHTML = '';
    
    // Act & Assert: We expect the script to throw a specific error.
    // We wrap the require() call in a function for `toThrow` to work.
    const executeMain = () => {
      jest.isolateModules(() => {
        require('./main.tsx');
      });
    };
    
    expect(executeMain).toThrow('Failed to find the root element');
  });
});