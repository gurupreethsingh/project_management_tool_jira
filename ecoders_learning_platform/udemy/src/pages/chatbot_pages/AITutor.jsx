// src/pages/chatbot_pages/AiTutor.jsx
import React from "react";
import AiTutorAssistantShell from "../chatbot_pages/AiTutorAssistantShell";

export default function AiTutor() {
  return (
    <AiTutorAssistantShell
      title="AI Tutor"
      scope="ai-tutor"
      placeholder="Ask only the trained topics for now (Inheritance / Polymorphism / Encapsulation)…"
      starterPrompts={[
        "What are arithmetic operators in Python?",
        "What is integer division in Python?",
        "How does Python update variable values?",
        "What is > and < operator in Python?",
        "Show me common string problems in Python and common mistakes.",
        "Explain power calculation in default arguments step by step.",
        "Teach me a filter() example that filter truthy values with a small program.",
        "Show me higher-order functions in Python in simple words.",
        "Explain list comprehension to remove empty strings for beginners.",
        "Explain list comprehension to filter even numbers in simple words.",
      ]}
    />
  );
}
