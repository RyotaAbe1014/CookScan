import { describe, test, expect } from "vitest";
import {
  getWeekStart,
  getWeekDates,
  formatShortDate,
  parseLocalDate,
} from "../utils";

describe("getWeekStart", () => {
  test("月曜日を渡すとその日を返す", () => {
    // 2026-03-02 は月曜日
    const result = getWeekStart(new Date(2026, 2, 2));
    expect(result).toBe("2026-03-02");
  });

  test("水曜日を渡すとその週の月曜日を返す", () => {
    // 2026-03-04 は水曜日
    const result = getWeekStart(new Date(2026, 2, 4));
    expect(result).toBe("2026-03-02");
  });

  test("日曜日を渡すとその週の月曜日を返す", () => {
    // 2026-03-08 は日曜日 → 月曜は 2026-03-02
    const result = getWeekStart(new Date(2026, 2, 8));
    expect(result).toBe("2026-03-02");
  });

  test("土曜日を渡すとその週の月曜日を返す", () => {
    // 2026-03-07 は土曜日 → 月曜は 2026-03-02
    const result = getWeekStart(new Date(2026, 2, 7));
    expect(result).toBe("2026-03-02");
  });

  test("連続して次の週に進める", () => {
    let weekStart = "2026-02-23";
    const results: string[] = [];

    for (let i = 0; i < 5; i++) {
      const current = new Date(weekStart);
      current.setDate(current.getDate() + 7);
      weekStart = getWeekStart(current);
      results.push(weekStart);
    }

    expect(results).toEqual([
      "2026-03-02",
      "2026-03-09",
      "2026-03-16",
      "2026-03-23",
      "2026-03-30",
    ]);
  });

  test("連続して前の週に戻れる", () => {
    let weekStart = "2026-03-30";
    const results: string[] = [];

    for (let i = 0; i < 3; i++) {
      const current = new Date(weekStart);
      current.setDate(current.getDate() - 7);
      weekStart = getWeekStart(current);
      results.push(weekStart);
    }

    expect(results).toEqual(["2026-03-23", "2026-03-16", "2026-03-09"]);
  });

  test("月をまたぐ場合も正しく計算される", () => {
    // 2026-02-28 は土曜日 → 月曜は 2026-02-23
    const result = getWeekStart(new Date(2026, 1, 28));
    expect(result).toBe("2026-02-23");
  });

  test("年をまたぐ場合も正しく計算される", () => {
    // 2027-01-01 は金曜日 → 月曜は 2026-12-28
    const result = getWeekStart(new Date(2027, 0, 1));
    expect(result).toBe("2026-12-28");
  });

  test("YYYY-MM-DD形式の文字列を返す", () => {
    const result = getWeekStart(new Date(2026, 0, 5));
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("parseLocalDate", () => {
  test("YYYY-MM-DD文字列をローカルタイムゾーンのDateに変換する", () => {
    const result = parseLocalDate("2026-03-02");
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2); // 0-indexed
    expect(result.getDate()).toBe(2);
  });

  test("UTCではなくローカルタイムゾーンで解釈される", () => {
    const result = parseLocalDate("2026-03-02");
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });
});

describe("getWeekDates", () => {
  test("7日分の日付を返す", () => {
    const dates = getWeekDates("2026-03-02");
    expect(dates).toHaveLength(7);
  });

  test("月曜日から日曜日までの連続した日付を返す", () => {
    const dates = getWeekDates("2026-03-02");
    const dayNumbers = dates.map((d) => d.getDate());
    expect(dayNumbers).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });
});

describe("formatShortDate", () => {
  test("M/D形式でフォーマットする", () => {
    const result = formatShortDate(new Date(2026, 2, 2));
    expect(result).toBe("3/2");
  });

  test("1月1日を正しくフォーマットする", () => {
    const result = formatShortDate(new Date(2026, 0, 1));
    expect(result).toBe("1/1");
  });

  test("12月31日を正しくフォーマットする", () => {
    const result = formatShortDate(new Date(2026, 11, 31));
    expect(result).toBe("12/31");
  });
});
