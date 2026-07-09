/**
 * Parser utilities for processing AI (Gemini) responses.
 * Handles JSON extraction, markdown stripping, and safe parsing.
 */

/**
 * Strip markdown code fences from a string.
 * Handles ```json ... ```, ```text ... ```, and plain ``` ... ```.
 */
export function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:json|text|markdown)?\s*\n?/gim, "")
    .replace(/\n?```\s*$/gim, "")
    .trim();
}

/**
 * Safely parse a JSON string. Returns null on failure instead of throwing.
 */
export function safeParseJSON<T = unknown>(raw: string): T | null {
  try {
    const cleaned = stripCodeFences(raw);
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

/**
 * Extract the first JSON object or array from a potentially mixed text response.
 * Looks for the first `{` or `[` and matches it to its closing brace/bracket.
 */
export function extractJSON<T = unknown>(text: string): T | null {
  const cleaned = stripCodeFences(text);

  /* Find the first `{` or `[` */
  const objStart = cleaned.indexOf("{");
  const arrStart = cleaned.indexOf("[");

  let start: number;
  let openChar: string;
  let closeChar: string;

  if (objStart === -1 && arrStart === -1) return null;

  if (objStart === -1) {
    start = arrStart;
    openChar = "[";
    closeChar = "]";
  } else if (arrStart === -1) {
    start = objStart;
    openChar = "{";
    closeChar = "}";
  } else if (objStart < arrStart) {
    start = objStart;
    openChar = "{";
    closeChar = "}";
  } else {
    start = arrStart;
    openChar = "[";
    closeChar = "]";
  }

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === "\\") {
      escape = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === openChar) depth++;
    if (ch === closeChar) depth--;

    if (depth === 0) {
      const jsonStr = cleaned.slice(start, i + 1);
      try {
        return JSON.parse(jsonStr) as T;
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Split a multi-section AI response into keyed sections.
 * Looks for markdown headings (## Section Name) and returns a map.
 */
export function parseSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = text.split("\n");
  let currentKey = "preamble";
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      if (currentContent.length > 0) {
        sections[currentKey] = currentContent.join("\n").trim();
      }
      currentKey = headingMatch[1].toLowerCase().replace(/\s+/g, "_");
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0) {
    sections[currentKey] = currentContent.join("\n").trim();
  }

  return sections;
}

/**
 * Extract a list of items from a bullet-pointed or numbered AI response.
 */
export function parseList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s]*[-*•]\s*/, "").replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0);
}
