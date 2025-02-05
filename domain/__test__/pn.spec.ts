import { describe, expect, it } from "vitest";
import { escapeHtml } from "@utils/html";
import { findPn, getBgColorKey, getReplacementKey, getTextColorKey, isPnRule } from "../pn";
import { genMarker } from "@domain/html";

describe("get pn rule keyword", () => {
  const keywords = [
    "p1 :",
    "p2 :",
    "p3 :",
    "P1 :",
    "P2 :",
    "P3 :",
    "p1:",
    "p2:",
    "p3:",
    "P1:",
    "P2:",
    "P3:",
  ];
  it("should return true if the rule is a pn rule", () => {
    for (const keyword of keywords) {
      expect(isPnRule(keyword)).toBe(true);
    }
  });

  it("should return keyword if the rule is a pn rule", () => {
    for (const keyword of keywords) {
      expect(findPn(keyword)).toBe(keyword.split(":")[0].trim());
    }
  });
});

describe("replace inner html", () => {
  it("should replace inner html with replacement map", () => {
    const innerHtml = `P3: db &gt; 인스턴스 &gt; sqlserver &gt; 싱글뷰 &gt; Session Elapsed Time &gt; Less than 2 seconds &gt; blocked에 auto refresh 옵션을 키지 않은 채로 엑셀 추출하면 여러번 시도했는데 데이터가 다르게 나오는데 스펙인가요?`;
    const replacementMap = {
      p3: "replaced",
      "p3-bg-color": "red",
      "p3-text-color": "blue",
    } as any;
    const expected = `<mark name="p3" style="background-color: red; color: blue">replaced</mark>: db &gt; 인스턴스 &gt; sqlserver &gt; 싱글뷰 &gt; Session Elapsed Time &gt; Less than 2 seconds &gt; blocked에 auto refresh 옵션을 키지 않은 채로 엑셀 추출하면 여러번 시도했는데 데이터가 다르게 나오는데 스펙인가요?`;

    const pn = findPn(innerHtml);

    expect(pn).toBe("P3");

    const replacementKey = getReplacementKey(pn as "P3");
    const bgColorKey = getBgColorKey(pn as "P3");
    const textColorKey = getTextColorKey(pn as "P3");

    expect(replacementKey).toBe("p3");
    expect(bgColorKey).toBe("p3-bg-color");
    expect(textColorKey).toBe("p3-text-color");

    expect(
      innerHtml.replace(
        pn!,
        genMarker({
          name: replacementKey,
          bgColor: escapeHtml(replacementMap[bgColorKey]),
          textColor: escapeHtml(replacementMap[textColorKey]),
          replacement: escapeHtml(replacementMap[replacementKey]),
        })
      )
    ).toBe(expected);
  });
});
