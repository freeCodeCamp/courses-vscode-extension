import * as vscode from 'vscode';
import developCourse from './develop-course';
import { handleConfig } from '../handles';
import { handleMessage } from '../flash';
import { FlashTypes } from '../typings';

// Mock the required modules
jest.mock('vscode', () => ({
  workspace: {
    getConfiguration: jest.fn(),
  },
}));

jest.mock('../handles', () => ({
  handleConfig: jest.fn(),
}));

jest.mock('../flash', () => ({
  handleMessage: jest.fn(),
}));

describe('developCourse', () => {
  const mockGetConfiguration = vscode.workspace.getConfiguration as jest.Mock;
  const mockHandleConfig = handleConfig as jest.Mock;
  const mockHandleMessage = handleMessage as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle configuration successfully when no error occurs', async () => {
    // Arrange
    const mockConfig = { get: jest.fn() };
    mockGetConfiguration.mockReturnValue(mockConfig);
    
    // Act
    await developCourse();

    // Assert
    expect(mockGetConfiguration).toHaveBeenCalledWith('freecodecamp-courses');
    expect(mockHandleConfig).toHaveBeenCalledWith(mockConfig, 'develop-course');
    expect(mockHandleMessage).not.toHaveBeenCalled();
  });

  it('should handle errors properly and show error message', async () => {
    // Arrange
    const error = new Error('Test error');
    mockGetConfiguration.mockImplementation(() => {
      throw error;
    });

    // Act
    await developCourse();

    // Assert
    expect(mockGetConfiguration).toHaveBeenCalledWith('freecodecamp-courses');
    expect(mockHandleConfig).not.toHaveBeenCalled();
    expect(mockHandleMessage).toHaveBeenCalledWith({
      message: 'Unable to develop course. See dev console for more details.',
      type: FlashTypes.ERROR,
    });
  });

  it('should handle errors from handleConfig function', async () => {
    // Arrange
    const error = new Error('Config error');
    const mockConfig = { get: jest.fn() };
    mockGetConfiguration.mockReturnValue(mockConfig);
    mockHandleConfig.mockImplementation(() => {
      throw error;
    });

    // Act
    await developCourse();

    // Assert
    expect(mockGetConfiguration).toHaveBeenCalledWith('freecodecamp-courses');
    expect(mockHandleConfig).toHaveBeenCalledWith(mockConfig, 'develop-course');
    expect(mockHandleMessage).toHaveBeenCalledWith({
      message: 'Unable to develop course. See dev console for more details.',
      type: FlashTypes.ERROR,
    });
  });

  it('should log error to console when an error occurs', async () => {
    // Arrange
    const error = new Error('Test error');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockGetConfiguration.mockImplementation(() => {
      throw error;
    });

    // Act
    await developCourse();

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('freeCodeCamp > runCourse: ', error);

    // Cleanup
    consoleSpy.mockRestore();
  });
});