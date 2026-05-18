import {
  openTerminal,
  openSimpleBrowser,
  currentDirectoryCourse,
} from "./components";
import { showInputBox, promptQuickPick } from "./inputs";
import { ensureDirectoryIsEmpty, cd } from "./usefuls";
import { handleMessage, showMessage } from "./flash";
import { everythingButHandles } from "./index";

// Mock all the imported modules to test the exports properly
jest.mock("./components", () => ({
  openTerminal: jest.fn(),
  openSimpleBrowser: jest.fn(),
  currentDirectoryCourse: jest.fn(),
}));

jest.mock("./inputs", () => ({
  showInputBox: jest.fn(),
  promptQuickPick: jest.fn(),
}));

jest.mock("./usefuls", () => ({
  ensureDirectoryIsEmpty: jest.fn(),
  cd: jest.fn(),
}));

jest.mock("./flash", () => ({
  handleMessage: jest.fn(),
  showMessage: jest.fn(),
}));

describe("Index exports", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should export everythingButHandles object", () => {
    expect(everythingButHandles).toBeDefined();
    expect(typeof everythingButHandles).toBe("object");
  });

  test("should contain all expected functions in everythingButHandles", () => {
    expect(everythingButHandles).toHaveProperty("currentDirectoryCourse");
    expect(everythingButHandles).toHaveProperty("ensureDirectoryIsEmpty");
    expect(everythingButHandles).toHaveProperty("promptQuickPick");
    expect(everythingButHandles).toHaveProperty("openSimpleBrowser");
    expect(everythingButHandles).toHaveProperty("openTerminal");
    expect(everythingButHandles).toHaveProperty("showInputBox");
    expect(everythingButHandles).toHaveProperty("handleMessage");
    expect(everythingButHandles).toHaveProperty("showMessage");
    expect(everythingButHandles).toHaveProperty("cd");
  });

  test("should map currentDirectoryCourse correctly", () => {
    expect(everythingButHandles.currentDirectoryCourse).toBe(currentDirectoryCourse);
  });

  test("should map ensureDirectoryIsEmpty correctly", () => {
    expect(everythingButHandles.ensureDirectoryIsEmpty).toBe(ensureDirectoryIsEmpty);
  });

  test("should map promptQuickPick correctly", () => {
    expect(everythingButHandles.promptQuickPick).toBe(promptQuickPick);
  });

  test("should map openSimpleBrowser correctly", () => {
    expect(everythingButHandles.openSimpleBrowser).toBe(openSimpleBrowser);
  });

  test("should map openTerminal correctly", () => {
    expect(everythingButHandles.openTerminal).toBe(openTerminal);
  });

  test("should map showInputBox correctly", () => {
    expect(everythingButHandles.showInputBox).toBe(showInputBox);
  });

  test("should map handleMessage correctly", () => {
    expect(everythingButHandles.handleMessage).toBe(handleMessage);
  });

  test("should map showMessage correctly", () => {
    expect(everythingButHandles.showMessage).toBe(showMessage);
  });

  test("should map cd correctly", () => {
    expect(everythingButHandles.cd).toBe(cd);
  });

  test("everythingButHandles functions should be callable", () => {
    // Test that all functions in everythingButHandles are actually functions
    Object.values(everythingButHandles).forEach((item) => {
      expect(typeof item).toBe("function");
    });
  });
});