// src/components/ai_components/RoadmapGen.jsx
import React from "react";
import RoadmapAssistantShell from "./RoadmapAssistantShell";

export default function RoadmapGen() {
  return (
    <RoadmapAssistantShell
      title="Roadmap Generator"
      scope="roadmap-gen"
      placeholder="Describe the roadmap you want (e.g., '1-year MERN stack syllabus with weekly plan, labs, projects, outcomes')…"
      starterPrompts={[
        "2-year MSc in AI & ML — 4 semesters with labs, projects, and outcomes.",
        "1-year Python + Data Science roadmap (weekly), include capstone project.",
        "6-month Selenium Test Automation syllabus with hands-on labs.",
        "Full-stack MERN roadmap (12 months), monthly milestones + revision plan.",
        "DevOps roadmap (Docker, Kubernetes, CI/CD) in 9 months with projects.",
        "Cybersecurity curriculum (1 year) with blue team labs and certifications.",
        "Cloud Architect (AWS) roadmap (6 months) with practice projects.",
        "DSA + System Design (interview-oriented) 6-month plan with mocks.",
      ]}
    />
  );
}
