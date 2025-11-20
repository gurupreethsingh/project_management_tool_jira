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
        "Write a Python function to calculate SIP returns with proper docstring and basic input validation.",
        "Generate a Node.js Express route that handles user login with JWT authentication and error handling.",
        "Create a React component that renders a responsive navbar with dropdown menu and dark mode toggle.",
        "Write a Java class for a simple bank account with deposit, withdraw, and balance methods, including basic validations.",
        "Generate a RESTful Flask API with CRUD endpoints for a 'Course' resource and in-memory storage.",
        "Create a SQL schema and sample INSERT statements for a simple e-commerce system (users, products, orders, order_items).",
      ]}
    />
  );
}
