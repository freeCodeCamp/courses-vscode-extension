import { isInstallFinished, createLoaderWebView } from './loader';
import { ViewColumn, window } from 'vscode';

// Mock the vscode module
jest.mock('vscode', () => ({
  ViewColumn: {
    One: 1,
  },
  window: {
    createWebviewPanel: jest.fn(),
  },
}));

// Mock for the webview panel
const mockWebview = {
  html: '',
};

const mockPanel = {
  webview: mockWebview,
};

// Mock the createWebviewPanel function
(window.createWebviewPanel as jest.MockedFunction<typeof window.createWebviewPanel>)
  .mockReturnValue(mockPanel as any);

describe('loader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isInstallFinished', () => {
    it('should resolve to true after 1 second', async () => {
      const promise = isInstallFinished();
      
      // Fast-forward time by 1000ms
      jest.useFakeTimers();
      const result = promise;
      jest.advanceTimersByTime(1000);
      jest.useRealTimers();
      
      await expect(result).resolves.toBe(true);
    });

    it('should take approximately 1 second to resolve', async () => {
      jest.useFakeTimers();
      
      const start = Date.now();
      const promise = isInstallFinished();
      
      // Fast-forward time by 1000ms
      jest.advanceTimersByTime(1000);
      
      await promise;
      
      const end = Date.now();
      const elapsed = end - start;
      
      // The elapsed time should be close to 1000ms
      expect(elapsed).toBeGreaterThanOrEqual(990); // Account for slight timing variations
      expect(elapsed).toBeLessThanOrEqual(1010);
      
      jest.useRealTimers();
    });
  });

  describe('createLoaderWebView', () => {
    it('should create a webview panel with correct parameters', () => {
      createLoaderWebView();

      expect(window.createWebviewPanel).toHaveBeenCalledWith(
        'Loader',
        'Loading',
        ViewColumn.One,
        {}
      );
    });

    it('should set the webview HTML to the loader HTML', () => {
      const panel = createLoaderWebView();

      // Verify that the HTML contains expected content
      expect(panel.webview.html).toContain('<!DOCTYPE html>');
      expect(panel.webview.html).toContain('freeCodeCamp logo');
      expect(panel.webview.html).toContain('Preparing the course...');
      expect(panel.webview.html).toContain('.loader');
    });

    it('should return a panel object with webview property', () => {
      const panel = createLoaderWebView();

      expect(panel).toHaveProperty('webview');
      expect(panel.webview).toHaveProperty('html');
      expect(typeof panel.webview.html).toBe('string');
    });

    it('should include the correct logo URL in the HTML', () => {
      const panel = createLoaderWebView();

      expect(panel.webview.html).toContain('https://raw.githubusercontent.com/freeCodeCamp/cdn/main/build/platform/universal/fcc_primary.svg');
    });

    it('should contain the loader animation elements', () => {
      const panel = createLoaderWebView();

      expect(panel.webview.html).toContain('<div class="loader">');
      expect(panel.webview.html).toContain('<div></div>');
      expect(panel.webview.html).toContain('@keyframes load');
    });
  });
});