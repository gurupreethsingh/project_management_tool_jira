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
        // ✅ Inheritance (trained)
        "What is inheritance in Python? Give definition, explanation, applications/uses, and example code.",
        "Explain inheritance in Python with a simple parent class and child class example code.",
        "Difference between single inheritance and multiple inheritance in Python with examples.",
        "What is method overriding in inheritance? Explain with Python code example.",

        // ✅ Polymorphism (trained)
        "What is polymorphism in Python? Give definition, explanation, applications/uses, and example code.",
        "Explain polymorphism in Python using the same method name in different classes with code.",
        "Explain duck typing in Python as polymorphism with a simple example.",

        // ✅ Encapsulation (trained)
        "What is encapsulation in Python? Give definition, explanation, applications/uses, and example code.",
        "Explain public, protected, and private members in Python with examples.",
        "Explain getters and setters in Python with encapsulation example code.",
      ]}
    />
  );
}
