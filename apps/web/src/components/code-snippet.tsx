"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  code: string;
  lineStart: number;
  highlightedLine: number;
}

export function CodeSnippet({ code, lineStart, highlightedLine }: Props) {
  return (
    <SyntaxHighlighter
      language="typescript"
      style={oneDark}
      showLineNumbers
      startingLineNumber={lineStart}
      wrapLines
      customStyle={{
        borderRadius: "0",
        padding: "18px 16px",
        background: "#05070a",
        fontSize: "12px",
        margin: 0,
        lineHeight: "1.7",
      }}
      lineNumberStyle={{
        color: "#3f3f46",
        minWidth: "2.5em",
        paddingRight: "1.5em",
        userSelect: "none",
        fontFamily: "inherit",
      }}
      lineProps={(lineNumber) => {
        if (lineNumber === highlightedLine) {
          return {
            style: {
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              borderLeft: "2px solid rgba(239, 68, 68, 0.7)",
              display: "block",
              marginLeft: "-16px",
              paddingLeft: "14px",
            },
          };
        }
        return { style: { display: "block" } };
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
