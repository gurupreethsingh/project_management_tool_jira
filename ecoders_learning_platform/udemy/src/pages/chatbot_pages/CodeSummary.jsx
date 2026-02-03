// src/pages/ai_pages/CodeSummary.jsx
import React from "react";
import CodeSummaryGenAssistantShell from "./CodeSummaryGenAssistantShell";

export default function CodeSummary() {
  return (
    <CodeSummaryGenAssistantShell
      title="Code Summary"
      scope="summary"
      placeholder="Paste code or a snippet to summarize & explain…"
      starterPrompts={[
        "Summarize this function and list potential edge cases.",
        "Explain time and space complexity of this code.",
        "Document this file with JSDoc comments.",
        "Find potential bugs and suggest refactors.",
      ]}
    />
  );
}
