import * as vscode from 'vscode';

// Create a proper mock for VS Code API before importing the function
const mockExecuteCommand = jest.fn();
const mockSelection = {
  start: { line: 0, character: 0 },
  end: { line: 0, character: 0 }
};

let mockActiveTextEditor: any = null;

const mockWindow = {
  get activeTextEditor() {
    return mockActiveTextEditor;
  }
};

// Properly mock the vscode module
jest.mock('vscode', () => ({
  window: mockWindow,
  commands: {
    executeCommand: mockExecuteCommand
  }
}));

// Now import after the mock is set up
import collapse from './collapse';

describe('collapse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockActiveTextEditor = null;
    mockExecuteCommand.mockResolvedValue(undefined);
  });

  test('should return early if no active text editor', async () => {
    mockActiveTextEditor = null;

    await collapse();

    expect(mockExecuteCommand).not.toHaveBeenCalled();
  });

  test('should execute selectHighlights and fold commands when editor exists', async () => {
    mockActiveTextEditor = {
      selections: [mockSelection]
    };

    await collapse();

    expect(mockExecuteCommand).toHaveBeenCalledWith('editor.action.selectHighlights');
    expect(mockExecuteCommand).toHaveBeenCalledWith('editor.fold', mockSelection.start);
  });

  test('should handle multiple selections', async () => {
    const selection1 = { start: { line: 0, character: 0 } };
    const selection2 = { start: { line: 5, character: 10 } };

    mockActiveTextEditor = {
      selections: [selection1, selection2]
    };

    await collapse();

    expect(mockExecuteCommand).toHaveBeenCalledWith('editor.action.selectHighlights');
    expect(mockExecuteCommand).toHaveBeenCalledWith('editor.fold', selection1.start);
    expect(mockExecuteCommand).toHaveBeenCalledWith('editor.fold', selection2.start);
  });

  test('should handle error when executing selectHighlights command', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockActiveTextEditor = {
      selections: [mockSelection]
    };

    mockExecuteCommand.mockRejectedValueOnce(new Error('Command failed'));

    await collapse();

    expect(consoleSpy).toHaveBeenCalledWith('freeCodeCamp Courses: ', expect.any(Error));
    consoleSpy.mockRestore();
  });

  test('should handle error when executing fold command', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockActiveTextEditor = {
      selections: [mockSelection]
    };

    mockExecuteCommand.mockResolvedValueOnce(undefined); // selectHighlights succeeds
    mockExecuteCommand.mockRejectedValueOnce(new Error('Fold failed')); // fold fails

    await collapse();

    expect(consoleSpy).toHaveBeenCalledWith('freeCodeCamp Courses: ', expect.any(Error));
    consoleSpy.mockRestore();
  });

  test('should execute commands in the correct order', async () => {
    mockActiveTextEditor = {
      selections: [mockSelection]
    };

    await collapse();

    // Verify that selectHighlights is called before fold
    expect(mockExecuteCommand).toHaveBeenNthCalledWith(1, 'editor.action.selectHighlights');
    expect(mockExecuteCommand).toHaveBeenNthCalledWith(2, 'editor.fold', mockSelection.start);
  });
});