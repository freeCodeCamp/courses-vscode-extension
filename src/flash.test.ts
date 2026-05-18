import { FlashTypes, Flash } from './typings';
import { showMessage, flasher, handleMessage } from './flash';
import { window } from 'vscode';

// Mock the vscode window module
jest.mock('vscode', () => ({
  window: {
    showInformationMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
  },
}));

describe('flash', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showMessage', () => {
    it('should create a function that calls the shower with a string and options', () => {
      const mockShower = jest.fn();
      const messageFunc = showMessage(mockShower);
      
      const testMessage = 'Test message';
      const testOpts = { detail: 'Test detail', modal: true };
      
      messageFunc(testMessage, testOpts);
      
      expect(mockShower).toHaveBeenCalledWith(testMessage, testOpts);
    });

    it('should work with undefined options', () => {
      const mockShower = jest.fn();
      const messageFunc = showMessage(mockShower);
      
      const testMessage = 'Test message';
      
      messageFunc(testMessage, undefined);
      
      expect(mockShower).toHaveBeenCalledWith(testMessage, undefined);
    });
  });

  describe('flasher', () => {
    it('should have INFO key that maps to showInformationMessage', () => {
      const testMessage = 'Info message';
      const testOpts = { detail: 'Info detail' };
      
      (flasher[FlashTypes.INFO] as any)(testMessage, testOpts);
      
      expect(window.showInformationMessage).toHaveBeenCalledWith(testMessage, testOpts);
    });

    it('should have WARNING key that maps to showWarningMessage', () => {
      const testMessage = 'Warning message';
      const testOpts = { detail: 'Warning detail' };
      
      (flasher[FlashTypes.WARNING] as any)(testMessage, testOpts);
      
      expect(window.showWarningMessage).toHaveBeenCalledWith(testMessage, testOpts);
    });

    it('should have ERROR key that maps to showErrorMessage', () => {
      const testMessage = 'Error message';
      const testOpts = { detail: 'Error detail' };
      
      (flasher[FlashTypes.ERROR] as any)(testMessage, testOpts);
      
      expect(window.showErrorMessage).toHaveBeenCalledWith(testMessage, testOpts);
    });
  });

  describe('handleMessage', () => {
    it('should call the appropriate flasher function based on flash type', () => {
      const infoFlash: Flash = {
        message: 'Info message',
        type: FlashTypes.INFO,
        opts: { detail: 'Info detail' }
      };
      
      handleMessage(infoFlash);
      
      expect(window.showInformationMessage).toHaveBeenCalledWith(
        infoFlash.message, 
        infoFlash.opts
      );
      expect(window.showWarningMessage).not.toHaveBeenCalled();
      expect(window.showErrorMessage).not.toHaveBeenCalled();
    });

    it('should handle WARNING flash type', () => {
      const warningFlash: Flash = {
        message: 'Warning message',
        type: FlashTypes.WARNING,
        opts: { detail: 'Warning detail', modal: true }
      };
      
      handleMessage(warningFlash);
      
      expect(window.showWarningMessage).toHaveBeenCalledWith(
        warningFlash.message, 
        warningFlash.opts
      );
      expect(window.showInformationMessage).not.toHaveBeenCalled();
      expect(window.showErrorMessage).not.toHaveBeenCalled();
    });

    it('should handle ERROR flash type', () => {
      const errorFlash: Flash = {
        message: 'Error message',
        type: FlashTypes.ERROR,
        opts: { detail: 'Error detail' }
      };
      
      handleMessage(errorFlash);
      
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        errorFlash.message, 
        errorFlash.opts
      );
      expect(window.showInformationMessage).not.toHaveBeenCalled();
      expect(window.showWarningMessage).not.toHaveBeenCalled();
    });

    it('should handle flash without options', () => {
      const infoFlash: Flash = {
        message: 'Info message without options',
        type: FlashTypes.INFO,
      };
      
      handleMessage(infoFlash);
      
      expect(window.showInformationMessage).toHaveBeenCalledWith(
        infoFlash.message, 
        undefined
      );
    });

    it('should throw an error if flash type is invalid', () => {
      const invalidFlash = {
        message: 'Invalid type message',
        type: 'invalid_type' as FlashTypes,
        opts: { detail: 'Detail' }
      };
      
      // This should not throw an error since flasher[invalid_type] would be undefined
      // and calling undefined() would throw an error naturally
      expect(() => {
        (flasher[invalidFlash.type] as any)(invalidFlash.message, invalidFlash.opts);
      }).toThrow();
    });
  });
});