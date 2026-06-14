import { describe, it, expect } from "vitest";
import { sanitizeHtml, sanitizeObject, stripScripts } from "./sanitize";

describe("Sanitization Utilities", () => {
  describe("sanitizeHtml", () => {
    it("should escape basic HTML characters", () => {
      const input = '<script>alert("xss")</script> & it\'s dangerous';
      const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt; &amp; it&#x27;s dangerous';
      expect(sanitizeHtml(input)).toBe(expected);
    });

    it("should not modify safe strings", () => {
      const input = "Just a normal string with numbers 123";
      expect(sanitizeHtml(input)).toBe(input);
    });
  });

  describe("stripScripts", () => {
    it("should remove script tags completely", () => {
      const input = "Hello <script>fetch('hacker')</script> World";
      expect(stripScripts(input)).toBe("Hello  World");
    });

    it("should remove inline handlers", () => {
      const input = '<img src="x" onerror="alert(1)" />';
      expect(stripScripts(input)).toBe('<img src="x"  />');
    });

    it("should remove javascript protocol", () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      expect(stripScripts(input)).toBe('<a href=":alert(1)">Click</a>');
    });
  });

  describe("sanitizeObject", () => {
    it("should recursively sanitize string properties", () => {
      const input = {
        name: "<b>Bold</b>",
        age: 25,
        details: {
          bio: "I'm a hacker",
          skills: ["React"]
        }
      };

      const output = sanitizeObject(input);
      expect(output.name).toBe("&lt;b&gt;Bold&lt;&#x2F;b&gt;");
      expect(output.age).toBe(25);
      expect((output.details as any).bio).toBe("I&#x27;m a hacker");
    });
  });
});
