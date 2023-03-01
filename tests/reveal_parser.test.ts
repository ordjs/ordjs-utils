import { RevealScriptParser } from "../ts_src";
import * as inscriptionRevealScripts from "./fixtures/reveal_script.json";

describe("RevealScriptParser", () => {
  let revealScriptParser = new RevealScriptParser();
  inscriptionRevealScripts.pngs.forEach((revealScriptData) => {
    test("RevealScriptParser parses inscription reveal script", () => {
      let parsedRevealScript = revealScriptParser.parse(
        revealScriptData.script
      );

      expect(parsedRevealScript.CONTENT_TYPE.toString("ascii")).toBe(
        "image/png"
      );

      expect(parsedRevealScript.BODY.length).toBe(revealScriptData.bodySize);

      if (revealScriptData.extra_data) {
        expect(parsedRevealScript.EXTRA_DATA.toString("hex")).toBe(
          revealScriptData.extra_data
        );
      }

      expect(parsedRevealScript.END_IF[0]).toBe(0x68);
    });
  });
});
