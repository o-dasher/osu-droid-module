import { BreakPoint } from "../../../src";

test("Test time coverage", () => {
    const breakPoint = new BreakPoint({
        startTime: 1000,
        endTime: 3000,
    });

    expect(breakPoint.contains(2000)).toBe(true);
    expect(breakPoint.contains(500)).toBe(false);

    // Break point active time is not exactly at end time
    expect(breakPoint.contains(2750)).toBe(false);
});
