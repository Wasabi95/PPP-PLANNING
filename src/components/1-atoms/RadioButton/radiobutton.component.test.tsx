// src/components/1-atoms/RadioButton/radiobutton.component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import RadioButton from './radio-button.component';
import '@testing-library/jest-dom';

describe('RadioButton Component', () => {

  test('should render the label and associate it with the radio input', () => {
    render(<RadioButton id="test-radio-1" label="Option A" name="test-group" />);
    const radioInput = screen.getByRole('radio', { name: 'Option A' });
    const labelText = screen.getByText('Option A');

    // --- THIS IS THE FIX ---
    // The `labelText` is the <span>. We need to find its parent <label> element.
    const labelContainer = labelText.closest('label');

    // Assert
    expect(radioInput).toBeInTheDocument();
    expect(labelContainer).toBeInTheDocument();
    
    // Now, we assert on the correct element.
    expect(labelContainer).toHaveAttribute('for', 'test-radio-1');
  });

  test('should be checked when the "checked" prop is true', () => {
    render(<RadioButton id="test-radio-2" label="Is Checked" name="test-group" checked={true} readOnly />);
    const radioInput = screen.getByRole('radio', { name: 'Is Checked' });
    expect(radioInput).toBeChecked();
  });

  test('should not be checked when the "checked" prop is false or omitted', () => {
    render(<RadioButton id="test-radio-3" label="Not Checked" name="test-group" checked={false} readOnly />);
    const radioInput = screen.getByRole('radio', { name: 'Not Checked' });
    expect(radioInput).not.toBeChecked();
  });

  test('should call the onChange handler when the label is clicked', () => {
    const handleChange = jest.fn();
    render(
      <RadioButton
        id="test-radio-4"
        label="Click me"
        name="test-group"
        onChange={handleChange}
      />
    );

    // This test was already correct because clicking the child span bubbles
    // the event up to the parent label, which triggers the input.
    const labelElement = screen.getByText('Click me');
    fireEvent.click(labelElement);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
  
  test('should call the onChange handler when the radio circle itself is clicked', () => {
    const handleChange = jest.fn();
    render(
      <RadioButton
        id="test-radio-5"
        label="Click the input"
        name="test-group"
        onChange={handleChange}
      />
    );
    const radioInput = screen.getByRole('radio', { name: 'Click the input' });
    fireEvent.click(radioInput);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('should correctly apply name and value attributes', () => {
    render(
      <RadioButton
        id="test-radio-6"
        label="Test Attrs"
        name="fruit-options"
        value="apple"
      />
    );
    const radioInput = screen.getByRole('radio', { name: 'Test Attrs' });
    expect(radioInput).toHaveAttribute('name', 'fruit-options');
    expect(radioInput).toHaveAttribute('value', 'apple');
  });
});