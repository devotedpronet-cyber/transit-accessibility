import { colorForAccessibility, labelForAccessibility } from "./mapColors.js";

describe("colorForAccessibility", () => {
  test("known-accessible stops render green", () => {
    expect(colorForAccessibility("known-accessible")).toBe("#34C759");
  });

  test("unknown accessibility renders neutral gray, never red", () => {
    // Red previously implied 'confirmed inaccessible' — no feed source supports
    // that claim, so unknown must never render as a false negative (red).
    expect(colorForAccessibility("unknown")).toBe("#8E8E93");
  });

  test("unrecognized values fall back to unknown color, not a crash", () => {
    expect(colorForAccessibility(undefined)).toBe("#8E8E93");
    expect(colorForAccessibility("garbage")).toBe("#8E8E93");
  });
});

describe("labelForAccessibility", () => {
  test("known-accessible has a positive label", () => {
    expect(labelForAccessibility("known-accessible")).toBe("Wheelchair accessible");
  });

  test("unknown is labeled honestly, not as inaccessible", () => {
    const label = labelForAccessibility("unknown");
    expect(label).toBe("Accessibility unknown");
    expect(label.toLowerCase()).not.toContain("not accessible");
    expect(label.toLowerCase()).not.toContain("inaccessible");
  });
});
