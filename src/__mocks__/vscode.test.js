const vscode = require('./vscode');

describe('VSCode Mock', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('window', () => {
    test('should have showQuickPick function', () => {
      expect(vscode.window).toBeDefined();
      expect(vscode.window.showQuickPick).toBeDefined();
      expect(typeof vscode.window.showQuickPick).toBe('function');
    });

    test('should have showInputBox function', () => {
      expect(vscode.window).toBeDefined();
      expect(vscode.window.showInputBox).toBeDefined();
      expect(typeof vscode.window.showInputBox).toBe('function');
    });

    test('showQuickPick should be mockable', () => {
      const mockReturnValue = ['item1', 'item2'];
      vscode.window.showQuickPick.mockResolvedValue(mockReturnValue);

      expect(vscode.window.showQuickPick).toBeDefined();
      expect(vscode.window.showQuickPick()).resolves.toEqual(mockReturnValue);
    });

    test('showInputBox should be mockable', () => {
      const mockReturnValue = 'test input';
      vscode.window.showInputBox.mockResolvedValue(mockReturnValue);

      expect(vscode.window.showInputBox).toBeDefined();
      expect(vscode.window.showInputBox()).resolves.toEqual(mockReturnValue);
    });

    test('showQuickPick should be called with correct arguments', async () => {
      const items = ['option1', 'option2'];
      const options = { placeHolder: 'Select an option' };
      
      await vscode.window.showQuickPick(items, options);
      
      expect(vscode.window.showQuickPick).toHaveBeenCalledWith(items, options);
    });

    test('showInputBox should be called with correct arguments', async () => {
      const options = { prompt: 'Enter value', value: 'default' };
      
      await vscode.window.showInputBox(options);
      
      expect(vscode.window.showInputBox).toHaveBeenCalledWith(options);
    });

    test('showQuickPick mock should track calls correctly', () => {
      vscode.window.showQuickPick();
      vscode.window.showQuickPick('arg1');
      vscode.window.showQuickPick('arg1', 'arg2');
      
      expect(vscode.window.showQuickPick).toHaveBeenCalledTimes(3);
      expect(vscode.window.showQuickPick).toHaveBeenNthCalledWith(1);
      expect(vscode.window.showQuickPick).toHaveBeenNthCalledWith(2, 'arg1');
      expect(vscode.window.showQuickPick).toHaveBeenNthCalledWith(3, 'arg1', 'arg2');
    });

    test('showInputBox mock should track calls correctly', () => {
      vscode.window.showInputBox();
      vscode.window.showInputBox('arg1');
      vscode.window.showInputBox('arg1', 'arg2');
      
      expect(vscode.window.showInputBox).toHaveBeenCalledTimes(3);
      expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1);
      expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(2, 'arg1');
      expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(3, 'arg1', 'arg2');
    });
  });
});