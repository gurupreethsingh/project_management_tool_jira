import React from "react";
import ExamGenAssistantShell from "../chatbot_pages/ExamGenAssistantShell";

export default function ExamGenerator() {
  return (
    <ExamGenAssistantShell
      title="Exam Question Paper Generator"
      scope="exam-gen"
      placeholder="Describe the exam paper you want (e.g., 'Python final exam, 100 marks, 5x20, sections A/B/C, only 2/4/5 mark sub-questions')…"
      starterPrompts={[
        "Generate a university style Python exam: 100 marks, 5x20, sections A/B/C, only 2/4/5 mark sub-questions.",
        "Preparatory exam paper for Python: same pattern as final, 5 main questions x 20 marks, detailed sub-questions.",
        "Create a mid-semester Python exam: 50 marks, 3 main questions, mix of theory and coding questions.",
        "Generate an end-semester Data Structures exam with Python: stacks, queues, trees, graphs, 100 marks.",
        "Make a DBMS exam paper (theory + SQL) for 100 marks with clear sections and sub-questions.",
        "Generate an OOP in Python exam paper for 70 marks focusing on classes, objects, inheritance, and polymorphism.",
      ]}
    />
  );
}
