import openCourse from './open-course';
import { window, commands } from 'vscode';
import { handleEmptyDirectory, createBackgroundTerminal } from '../handles';
import { promptQuickPick } from '../inputs';
import { currentDirectoryCourse } from '../components';
import { gitClone } from '../usefuls';

// Mock the VS Code API
jest.mock('vscode', () => ({
  window: {
    showInformationMessage: jest.fn(),
  },
  commands: {
    executeCommand: jest.fn(),
  },
}));

// Mock other modules
jest.mock('../handles', () => ({
  handleEmptyDirectory: jest.fn(),
  createBackgroundTerminal: jest.fn(),
}));

jest.mock('../inputs', () => ({
  promptQuickPick: jest.fn(),
}));

jest.mock('../components', () => ({
  currentDirectoryCourse: jest.fn(),
}));

jest.mock('../usefuls', () => ({
  gitClone: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('openCourse', () => {
  const mockCourses = [
    {
      name: 'Responsive Web Design',
      githubLink: 'https://github.com/freeCodeCamp/learn-responsive-web-design.git',
    },
    {
      name: 'JavaScript Algorithms and Data Structures',
      githubLink: 'https://github.com/freeCodeCamp/javascript-algorithms-and-data-structures.git',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock a successful fetch response
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        courses: mockCourses,
      }),
    } as unknown as Response);
  });

  it('should fetch courses and show quick pick', async () => {
    const mockCurrentDirectoryCourse = jest.mocked(currentDirectoryCourse);
    const mockPromptQuickPick = jest.mocked(promptQuickPick);

    mockCurrentDirectoryCourse.mockResolvedValue(null);
    mockPromptQuickPick.mockResolvedValue('Responsive Web Design');

    await openCourse();

    expect(fetch).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/freeCodeCamp/freecodecamp-courses/main/resources/courses.json'
    );
    expect(promptQuickPick).toHaveBeenCalledWith(
      ['Responsive Web Design', 'JavaScript Algorithms and Data Structures'],
      {
        placeHolder: 'Select a course',
        canPickMany: false,
      }
    );
  });

  it('should handle re-download option when course already exists', async () => {
    const mockCurrentDirectoryCourse = jest.mocked(currentDirectoryCourse);
    const mockPromptQuickPick = jest.mocked(promptQuickPick);

    mockCurrentDirectoryCourse.mockResolvedValue(
      'https://github.com/freeCodeCamp/learn-responsive-web-design.git'
    );
    mockPromptQuickPick.mockResolvedValue('Re-download: Responsive Web Design');

    await openCourse();

    expect(promptQuickPick).toHaveBeenCalledWith(
      ['Re-download: Responsive Web Design', 'JavaScript Algorithms and Data Structures'],
      {
        placeHolder: 'Select a course',
        canPickMany: false,
      }
    );
  });

  it('should handle empty directory and clone git repository when course is selected and not downloaded', async () => {
    const mockCurrentDirectoryCourse = jest.mocked(currentDirectoryCourse);
    const mockPromptQuickPick = jest.mocked(promptQuickPick);
    const mockHandleEmptyDirectory = jest.mocked(handleEmptyDirectory);
    const mockCreateBackgroundTerminal = jest.mocked(createBackgroundTerminal);
    const mockGitClone = jest.mocked(gitClone);

    mockCurrentDirectoryCourse.mockResolvedValue(null);
    mockPromptQuickPick.mockResolvedValue('Responsive Web Design');
    mockGitClone.mockReturnValue('git clone https://github.com/freeCodeCamp/learn-responsive-web-design.git');

    await openCourse();

    expect(mockHandleEmptyDirectory).toHaveBeenCalled();
    expect(mockGitClone).toHaveBeenCalledWith(
      'https://github.com/freeCodeCamp/learn-responsive-web-design.git'
    );
    expect(mockCreateBackgroundTerminal).toHaveBeenCalledWith(
      'freeCodeCamp: Git Course',
      'git clone https://github.com/freeCodeCamp/learn-responsive-web-design.git'
    );
  });

  it('should execute git pull when course is already downloaded and re-download is selected', async () => {
    const mockCurrentDirectoryCourse = jest.mocked(currentDirectoryCourse);
    const mockPromptQuickPick = jest.mocked(promptQuickPick);
    const mockCreateBackgroundTerminal = jest.mocked(createBackgroundTerminal);

    mockCurrentDirectoryCourse.mockResolvedValue(
      'https://github.com/freeCodeCamp/learn-responsive-web-design.git'
    );
    mockPromptQuickPick.mockResolvedValue('Re-download: Responsive Web Design');

    await openCourse();

    expect(mockCreateBackgroundTerminal).toHaveBeenCalledWith(
      'freeCodeCamp: Re-Git',
      'git pull'
    );
  });

  it('should show information message when course is selected', async () => {
    const mockCurrentDirectoryCourse = jest.mocked(currentDirectoryCourse);
    const mockPromptQuickPick = jest.mocked(promptQuickPick);
    const mockShowInformationMessage = jest.mocked(window.showInformationMessage);

    mockCurrentDirectoryCourse.mockResolvedValue(null);
    mockPromptQuickPick.mockResolvedValue('Responsive Web Design');

    await openCourse();

    expect(mockShowInformationMessage).toHaveBeenCalledWith(
      'Downloading Course: Responsive Web Design'
    );
  });

  it('should handle case when no course is selected', async () => {
    const mockCurrentDirectoryCourse = jest.mocked(currentDirectoryCourse);
    const mockPromptQuickPick = jest.mocked(promptQuickPick);

    mockCurrentDirectoryCourse.mockResolvedValue(null);
    mockPromptQuickPick.mockResolvedValue(undefined); // No selection

    await openCourse();

    // Should not call directory handling functions when no course is selected
    expect(handleEmptyDirectory).not.toHaveBeenCalled();
  });

  it('should handle fetch error gracefully', async () => {
    const mockCurrentDirectoryCourse = jest.mocked(currentDirectoryCourse);
    const mockPromptQuickPick = jest.mocked(promptQuickPick);

    mockCurrentDirectoryCourse.mockResolvedValue(null);
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error('Network error'));

    // Spy on console.error to verify error handling
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await openCourse();

    expect(consoleSpy).toHaveBeenCalledWith(new Error('Network error'));
    
    // Clean up
    consoleSpy.mockRestore();
  });

  it('should handle case when selected course name does not match any existing course', async () => {
    const mockCurrentDirectoryCourse = jest.mocked(currentDirectoryCourse);
    const mockPromptQuickPick = jest.mocked(promptQuickPick);
    const mockHandleEmptyDirectory = jest.mocked(handleEmptyDirectory);

    mockCurrentDirectoryCourse.mockResolvedValue(null); // No course currently downloaded
    mockPromptQuickPick.mockResolvedValue('Non-existent Course');

    await openCourse();

    // When a non-existent course name is selected but the course name doesn't match any actual course,
    // the find operation returns undefined, so course?.githubLink is undefined
    // The condition (undefined !== null) is true, so handleEmptyDirectory should be called
    // However, since the course isn't found, gitClone won't be called with valid URL
    // This results in an error being logged, but handleEmptyDirectory is still called
    expect(mockHandleEmptyDirectory).toHaveBeenCalled();
  });
});