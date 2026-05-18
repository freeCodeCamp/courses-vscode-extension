import { window } from "vscode";
import { promptQuickPick, showInputBox } from "./inputs";

describe("inputs", () => {
  describe("promptQuickPick", () => {
    it("should call window.showQuickPick with selections and options", async () => {
      const mockSelections = ["option1", "option2", "option3"];
      const mockOptions = {
        canPickMany: false,
        placeHolder: "Select an option",
      };

      const mockResult = "option1";
      (window.showQuickPick as any).mockResolvedValue(mockResult);

      const result = await promptQuickPick(mockSelections, mockOptions);

      expect(window.showQuickPick).toHaveBeenCalledWith(mockSelections, mockOptions);
      expect(result).toBe(mockResult);
    });

    it("should handle multiple selection when canPickMany is true", async () => {
      const mockSelections = ["option1", "option2", "option3"];
      const mockOptions = {
        canPickMany: true,
        placeHolder: "Select multiple options",
      };

      const mockResult = ["option1", "option2"];
      (window.showQuickPick as any).mockResolvedValue(mockResult);

      const result = await promptQuickPick(mockSelections, mockOptions);

      expect(window.showQuickPick).toHaveBeenCalledWith(mockSelections, mockOptions);
      expect(result).toEqual(mockResult);
    });

    it("should return undefined when no selection is made", async () => {
      const mockSelections = ["option1", "option2"];
      const mockOptions = {
        canPickMany: false,
      };

      (window.showQuickPick as any).mockResolvedValue(undefined);

      const result = await promptQuickPick(mockSelections, mockOptions);

      expect(window.showQuickPick).toHaveBeenCalledWith(mockSelections, mockOptions);
      expect(result).toBeUndefined();
    });
  });

  describe("showInputBox", () => {
    it("should call window.showInputBox with the placeholder", async () => {
      const mockPlaceholder = "Enter your name";
      const mockResult = "John Doe";

      (window.showInputBox as any).mockResolvedValue(mockResult);

      const result = await showInputBox(mockPlaceholder);

      expect(window.showInputBox).toHaveBeenCalledWith({
        placeHolder: mockPlaceholder,
      });
      expect(result).toBe(mockResult);
    });

    it("should return undefined when no input is provided", async () => {
      const mockPlaceholder = "Enter your name";

      (window.showInputBox as any).mockResolvedValue(undefined);

      const result = await showInputBox(mockPlaceholder);

      expect(window.showInputBox).toHaveBeenCalledWith({
        placeHolder: mockPlaceholder,
      });
      expect(result).toBeUndefined();
    });

    it("should return empty string when empty input is provided", async () => {
      const mockPlaceholder = "Enter your name";
      const mockResult = "";

      (window.showInputBox as any).mockResolvedValue(mockResult);

      const result = await showInputBox(mockPlaceholder);

      expect(window.showInputBox).toHaveBeenCalledWith({
        placeHolder: mockPlaceholder,
      });
      expect(result).toBe(mockResult);
    });
  });
});