import * as vscode from 'vscode';
import runCourse from './run-course';
import { handleConfig } from '../handles';
import { handleMessage } from '../flash';
import { FlashTypes } from '../typings';

// Mock the dependencies
jest.mock('../handles', () => ({
  handleConfig: jest.fn(),
}));

jest.mock('../flash', () => ({
  handleMessage: jest.fn(),
}));

jest.mock('vscode', () => ({
  workspace: {
    getConfiguration: jest.fn(),
  },
}));

// Get the mocked functions
const mockedHandleConfig = jest.mocked(handleConfig);
const mockedHandleMessage = jest.mocked(handleMessage);
const mockedGetConfiguration = jest.mocked(vscode.workspace.getConfiguration);

describe('runCourse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call handleConfig with correct parameters when configuration is available', async () => {
    // Arrange
    const mockConfig = {
      get: jest.fn().mockReturnValue('test-value'),
    };
    mockedGetConfiguration.mockReturnValue(mockConfig as any);

    // Act
    await runCourse();

    // Assert
    expect(mockedGetConfiguration).toHaveBeenCalledWith('freecodecamp-courses');
    expect(mockedHandleConfig).toHaveBeenCalledWith(mockConfig, 'run-course');
    expect(mockedHandleMessage).not.toHaveBeenCalled();
  });

  it('should display error message when getting configuration fails', async () => {
    // Arrange
    const error = new Error('Configuration error');
    mockedGetConfiguration.mockImplementation(() => {
      throw error;
    });

    // Act
    await runCourse();

    // Assert
    expect(mockedGetConfiguration).toHaveBeenCalledWith('freecodecamp-courses');
    expect(mockedHandleConfig).not.toHaveBeenCalled();
    expect(mockedHandleMessage).toHaveBeenCalledWith({
      message: "Unable to run course. See dev console for more details.",
      type: FlashTypes.ERROR,
    });
  });

  it('should display error message when handleConfig fails', async () => {
    // Arrange
    const mockConfig = {
      get: jest.fn().mockReturnValue('test-value'),
    };
    mockedGetConfiguration.mockReturnValue(mockConfig as any);
    const error = new Error('Handle config error');
    mockedHandleConfig.mockImplementation(() => {
      throw error;
    });

    // Act
    await runCourse();

    // Assert
    expect(mockedGetConfiguration).toHaveBeenCalledWith('freecodecamp-courses');
    expect(mockedHandleConfig).toHaveBeenCalledWith(mockConfig, 'run-course');
    expect(mockedHandleMessage).toHaveBeenCalledWith({
      message: "Unable to run course. See dev console for more details.",
      type: FlashTypes.ERROR,
    });
  });

  it('should console.error when handleConfig throws an exception', async () => {
    // Arrange
    const mockConfig = {
      get: jest.fn().mockReturnValue('test-value'),
    };
    mockedGetConfiguration.mockReturnValue(mockConfig as any);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const testError = new Error('Test error');
    mockedHandleConfig.mockImplementation(() => {
      throw testError;
    });

    // Act
    await runCourse();

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('freeCodeCamp > runCourse: ', testError);
    expect(mockedHandleMessage).toHaveBeenCalledWith({
      message: "Unable to run course. See dev console for more details.",
      type: FlashTypes.ERROR,
    });

    // Cleanup
    consoleSpy.mockRestore();
  });
});