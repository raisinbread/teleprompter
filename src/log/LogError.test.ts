import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import logError from './LogError.js';

describe('logError', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should call console.error with the formatted message', () => {
    logError('Test error');
    expect(console.error).toHaveBeenCalledWith('[Teleprompter] - Test error');
  });

  it('should handle empty messages', () => {
    logError('');
    expect(console.error).toHaveBeenCalledWith('[Teleprompter] - ');
  });

  it('should handle messages with special characters', () => {
    logError('Error: something went wrong! @#$%^&*()');
    expect(console.error).toHaveBeenCalledWith(
      '[Teleprompter] - Error: something went wrong! @#$%^&*()',
    );
  });
});
