// src/pages/ai_pages/AiTutor.jsx

import React from "react";
import AiTutorAssistantShell from "../chatbot_pages/AiTutorAssistantShell";

export default function AiTutor() {
  return (
    <AiTutorAssistantShell
      title="AI Tutor"
      scope="ai-tutor"
      placeholder="Ask your AI Tutor anything (e.g., 'Explain Python decorators with examples', 'Help me understand SQL joins with diagrams')…"
      starterPrompts={[
        "Explain Python lists, tuples, sets and dictionaries with simple examples.",
        "Teach me object-oriented programming in Python with classes, objects, inheritance and polymorphism.",
        "Help me understand SQL joins (INNER, LEFT, RIGHT, FULL) with small tables and clear diagrams.",
        "Explain time complexity of common data structures and algorithms in a simple way.",
        "Guide me step-by-step to build a small Flask API project as a beginner.",
        "Explain multithreading vs multiprocessing in Python with real-world examples.",
      ]}
    />
  );
}
