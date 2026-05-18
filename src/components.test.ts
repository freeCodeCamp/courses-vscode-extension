import { commands, Uri, workspace, window, Terminal } from "vscode";
import { openTerminal, openSimpleBrowser, currentDirectoryCourse } from "./components";
import { handleMessage } from "./flash";
import { FlashTypes } from "./typings";

// Mock VSCode API
jest.mock("vscode", () => ({
  commands: {
    executeCommand: jest.fn(),
  },
  workspace: {
    workspaceFolders: undefined,
    fs: {
      readFile: jest.fn(),
    },
  },
  window: {
    createTerminal: jest.fn(),
  },
  Uri: {
    file: jest.fn(),
    joinPath: jest.fn((uri, path) => ({
      fsPath: `${uri.fsPath}/${path}`,
      toString: () => `${uri.fsPath}/${path}`,
    })),
  },
}));

// Mock the flash module
jest.mock("./flash", () => ({
  handleMessage: jest.fn(),
}));

describe("components", () => {
  let mockTerminal: Terminal;
  let mockWorkspaceFolder: any;
  let mockUri: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTerminal = {
      sendText: jest.fn(),
      show: jest.fn(),
    } as any;

    (window.createTerminal as jest.Mock).mockReturnValue(mockTerminal);

    mockWorkspaceFolder = {
      uri: {
        fsPath: "/test/workspace",
      },
    };

    mockUri = {
      fsPath: "/test/workspace",
      toString: () => "/test/workspace",
    };

    (Uri.file as jest.Mock).mockReturnValue(mockUri);
    (Uri.joinPath as jest.Mock).mockImplementation((uri, path) => ({
      toString: () => `${uri.fsPath}/${path}`,
      fsPath: `${uri.fsPath}/${path}`,
    }));
  });

  describe("openTerminal", () => {
    it("should create a terminal with the name 'freeCodeCamp'", () => {
      openTerminal();
      
      expect(window.createTerminal).toHaveBeenCalledWith("freeCodeCamp");
    });

    it("should send the source command to the terminal", () => {
      openTerminal();
      
      expect(mockTerminal.sendText).toHaveBeenCalledWith(`source ~/.bashrc`, true);
    });

    it("should show the terminal", () => {
      openTerminal();
      
      expect(mockTerminal.show).toHaveBeenCalled();
    });

    it("should execute all terminal operations in sequence", () => {
      openTerminal();
      
      expect(window.createTerminal).toHaveBeenCalledWith("freeCodeCamp");
      expect(mockTerminal.sendText).toHaveBeenCalledWith(`source ~/.bashrc`, true);
      expect(mockTerminal.show).toHaveBeenCalled();
    });
  });

  describe("openSimpleBrowser", () => {
    it("should execute the simpleBrowser.show command with the provided URL", () => {
      const testUrl = "http://localhost:8080";
      
      openSimpleBrowser(testUrl);
      
      expect(commands.executeCommand).toHaveBeenCalledWith("simpleBrowser.show", testUrl);
    });

    it("should work with any URL string", () => {
      const urls = [
        "https://example.com",
        "http://localhost:3000/path",
        "https://freeCodeCamp.org/learn"
      ];
      
      urls.forEach(url => {
        openSimpleBrowser(url);
        expect(commands.executeCommand).toHaveBeenCalledWith("simpleBrowser.show", url);
        jest.clearAllMocks(); // Clear mocks for next iteration
      });
    });
  });

  describe("currentDirectoryCourse", () => {
    it("should return the github link from package.json when workspace folder exists", async () => {
      const mockWorkspaceFolders = [mockWorkspaceFolder];
      (workspace as any).workspaceFolders = mockWorkspaceFolders;
      
      const packageJsonData = {
        repository: {
          url: "https://github.com/freeCodeCamp/test-course.git"
        }
      };
      
      (workspace.fs.readFile as jest.Mock).mockResolvedValueOnce(
        Buffer.from(JSON.stringify(packageJsonData))
      );
      
      const result = await currentDirectoryCourse();
      
      expect(result).toBe("https://github.com/freeCodeCamp/test-course.git");
      expect(workspace.fs.readFile).toHaveBeenCalledWith(
        expect.objectContaining({ fsPath: "/test/workspace/package.json" })
      );
    });

    it("should return null when no workspace folders exist", async () => {
      (workspace as any).workspaceFolders = undefined;
      
      const result = await currentDirectoryCourse();
      
      expect(result).toBeNull();
    });

    it("should return null when the first workspace folder is undefined", async () => {
      (workspace as any).workspaceFolders = [];
      
      const result = await currentDirectoryCourse();
      
      expect(result).toBeNull();
    });

    it("should return null when repository URL is not present in package.json", async () => {
      const mockWorkspaceFolders = [mockWorkspaceFolder];
      (workspace as any).workspaceFolders = mockWorkspaceFolders;
      
      const packageJsonData = {
        name: "test-course",
        version: "1.0.0"
      };
      
      (workspace.fs.readFile as jest.Mock).mockResolvedValueOnce(
        Buffer.from(JSON.stringify(packageJsonData))
      );
      
      const result = await currentDirectoryCourse();
      
      expect(result).toBeNull();
    });

    it("should handle errors when reading package.json and return null", async () => {
      const mockWorkspaceFolders = [mockWorkspaceFolder];
      (workspace as any).workspaceFolders = mockWorkspaceFolders;
      
      (workspace.fs.readFile as jest.Mock).mockRejectedValueOnce(
        new Error("File not found")
      );
      
      const result = await currentDirectoryCourse();
      
      expect(result).toBeNull();
      expect(handleMessage).toHaveBeenCalledWith({
        message: expect.any(Error),
        type: FlashTypes.INFO,
      });
    });

    it("should handle errors when parsing package.json and return null", async () => {
      const mockWorkspaceFolders = [mockWorkspaceFolder];
      (workspace as any).workspaceFolders = mockWorkspaceFolders;
      
      (workspace.fs.readFile as jest.Mock).mockResolvedValueOnce(
        Buffer.from("invalid json")
      );
      
      const result = await currentDirectoryCourse();
      
      expect(result).toBeNull();
      expect(handleMessage).toHaveBeenCalledWith({
        message: expect.any(SyntaxError),
        type: FlashTypes.INFO,
      });
    });

    it("should handle errors when repository URL is null in package.json", async () => {
      const mockWorkspaceFolders = [mockWorkspaceFolder];
      (workspace as any).workspaceFolders = mockWorkspaceFolders;
      
      const packageJsonData = {
        repository: {
          url: null
        }
      };
      
      (workspace.fs.readFile as jest.Mock).mockResolvedValueOnce(
        Buffer.from(JSON.stringify(packageJsonData))
      );
      
      const result = await currentDirectoryCourse();
      
      expect(result).toBeNull();
    });
  });
});