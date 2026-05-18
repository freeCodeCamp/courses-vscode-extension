import { gitClone, cd, ensureDirectoryIsEmpty, checkIfURLIsAvailable } from './usefuls';
import { workspace, Uri } from 'vscode';

// Mock the vscode module
jest.mock('vscode', () => ({
  workspace: {
    fs: {
      readDirectory: jest.fn(),
    },
    workspaceFolders: [
      {
        uri: {
          fsPath: '/test/workspace',
        },
      },
    ],
  },
  Uri: {
    file: jest.fn((path) => ({ fsPath: path })),
  },
}));

describe('usefuls.ts', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('gitClone', () => {
    it('should return correct git clone command', () => {
      const githubLink = 'https://github.com/user/repo';
      const expected = 'git clone https://github.com/user/repo.git .';
      expect(gitClone(githubLink)).toBe(expected);
    });

    it('should handle different github links', () => {
      const githubLink = 'https://github.com/test-project';
      const expected = 'git clone https://github.com/test-project.git .';
      expect(gitClone(githubLink)).toBe(expected);
    });
  });

  describe('cd', () => {
    it('should return correct cd and command string', () => {
      const path = '/home/user';
      const cmd = 'ls -la';
      const expected = 'cd /home/user && ls -la';
      expect(cd(path, cmd)).toBe(expected);
    });

    it('should handle different paths and commands', () => {
      const path = './src';
      const cmd = 'npm install';
      const expected = 'cd ./src && npm install';
      expect(cd(path, cmd)).toBe(expected);
    });
  });

  describe('ensureDirectoryIsEmpty', () => {
    it('should return true when directory is empty', async () => {
      (workspace.fs.readDirectory as jest.MockedFunction<any>).mockResolvedValue([]);

      const result = await ensureDirectoryIsEmpty();
      expect(result).toBe(true);
      expect(workspace.fs.readDirectory).toHaveBeenCalledWith(
        Uri.file('/test/workspace')
      );
    });

    it('should return false when directory is not empty', async () => {
      (workspace.fs.readDirectory as jest.MockedFunction<any>).mockResolvedValue([
        ['file1.txt', 1],
        ['folder1', 2],
      ]);

      const result = await ensureDirectoryIsEmpty();
      expect(result).toBe(false);
    });

    it('should handle error when readDirectory fails', async () => {
      (workspace.fs.readDirectory as jest.MockedFunction<any>).mockRejectedValue(new Error('Directory read failed'));

      await expect(ensureDirectoryIsEmpty()).rejects.toBe(false);
    });

    it('should handle case when workspaceFolders is undefined', async () => {
      // Mock the workspace with undefined workspaceFolders for this test
      const originalWorkspaceFolders = (workspace as any).workspaceFolders;
      (workspace as any).workspaceFolders = undefined;

      // Since workspaceFolders is undefined, the fsPath will be empty string
      (workspace.fs.readDirectory as jest.MockedFunction<any>).mockResolvedValueOnce([]);

      const result = await ensureDirectoryIsEmpty();
      expect(result).toBe(true);

      // Restore original value
      (workspace as any).workspaceFolders = originalWorkspaceFolders;
    });
  });

  describe('checkIfURLIsAvailable', () => {
    // Mock the fetchWithTimeout function
    const mockFetchWithTimeout = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      // Mock fetchWithTimeout to return a mock response
      jest.spyOn(global.Date, 'now').mockImplementation(() => 1466424490000);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.useRealTimers();
    });

    it('should return true when URL returns 200 status immediately', async () => {
      // Mock the fetch function
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'basic',
        url: 'http://example.com',
        clone: () => new Response(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
      } as Response);

      const result = await checkIfURLIsAvailable('http://example.com', 1000);
      expect(result).toBe(true);
    });

    it('should return true when URL returns 200 status after some time', async () => {
      jest.useFakeTimers();
      
      // Mock fetch to return 200 on the second call
      let callCount = 0;
      global.fetch = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Network error'));
        } else {
          return Promise.resolve({ status: 200 });
        }
      });

      const promise = checkIfURLIsAvailable('http://example.com', 1000);

      // Fast-forward time by 250ms to trigger the first interval
      jest.advanceTimersByTime(250);
      
      // Fast-forward again to trigger the second interval
      jest.advanceTimersByTime(250);
      
      const result = await promise;
      expect(result).toBe(true);
    });

    it('should return false when timeout is reached', async () => {
      jest.useFakeTimers();
      
      // Mock fetch to always fail
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const promise = checkIfURLIsAvailable('http://example.com', 500);

      // Fast-forward time by 500ms to reach timeout
      jest.advanceTimersByTime(500);
      
      const result = await promise;
      expect(result).toBe(false);
    });

    it('should return false when URL does not return 200 status within timeout', async () => {
      jest.useFakeTimers();
      
      // Mock fetch to always return non-200 status
      global.fetch = jest.fn().mockResolvedValue({
        status: 404,
        ok: false,
        headers: new Headers(),
        redirected: false,
        statusText: 'Not Found',
        type: 'basic',
        url: 'http://example.com',
        clone: () => new Response(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
      } as Response);

      const promise = checkIfURLIsAvailable('http://example.com', 1000);

      // Fast-forward time to exceed the timeout
      jest.advanceTimersByTime(1000);
      
      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('fetchWithTimeout', () => {
    // This function is private but we can test it indirectly
    // through the checkIfURLIsAvailable function
    it('should be used by checkIfURLIsAvailable function', async () => {
      // We'll test that fetch is called with the correct parameters
      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockResolvedValue({
          status: 200,
          ok: true,
          headers: new Headers(),
          redirected: false,
          statusText: 'OK',
          type: 'basic',
          url: 'http://example.com',
          clone: () => new Response(),
          body: null,
          bodyUsed: false,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob()),
          formData: () => Promise.resolve(new FormData()),
          json: () => Promise.resolve({}),
          text: () => Promise.resolve(''),
        } as Response);

      await checkIfURLIsAvailable('http://example.com', 1000);

      // Verify that fetch was called with the expected parameters
      expect(fetchSpy).toHaveBeenCalledWith(
        'http://example.com',
        expect.objectContaining({
          signal: expect.anything(), // The AbortSignal
        })
      );
    });
  });
});