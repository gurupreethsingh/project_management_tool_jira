// src/pages/ai_pages/TextCodeGenerator.jsx

import React from "react";
import TextCodeGenAssistantShell from "../chatbot_pages/TextCodeGenAssistantShell";

export default function TextCodeGenerator() {
  return (
    <TextCodeGenAssistantShell
      title="Text to Code Generator"
      scope="text-code-gen"
      placeholder="Describe the code you want (e.g., 'Python function to calculate compound interest with docstring and unit tests')…"
      starterPrompts={[
        "compute gcd & lcm for two integers",
        "program binary search index of target in sorted list",
        "binary search index of target in sorted list python",
        "perform merge sort on an int arr",
        "python perform merge sort on an integer list",
        "Please perform merge sort on an integer list using Python; add basic erlor handling.",
      ]}
    />
  );
}
