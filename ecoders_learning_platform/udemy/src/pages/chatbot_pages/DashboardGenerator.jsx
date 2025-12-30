// src/pages/ai_pages/DashboardGenerator.jsx
import React from "react";
import DashboardGenAssistantShell from "../chatbot_pages/DashboardGenAssistantShell";

export default function DashboardGenerator() {
  return (
    <DashboardGenAssistantShell
      title="Dashboard Generator"
      scope="dashboard-gen"
      placeholder="Describe the dashboard you want (e.g., 'Student grades + attendance + risk flags dashboard with export and charts')…"
      starterPrompts={[
        "Student performance dashboard with grades, attendance %, and at-risk flags. Use React + Tailwind + Recharts and add an export action.",
        "College department dashboard showing student GPA distribution, attendance trends, and risk list with filters.",
        "School class dashboard with subject-wise marks, attendance shortage alerts, and export to CSV.",
        "University semester analytics dashboard with top performers, low attendance students, and risk indicators.",
        "Student risk alerts dashboard with triggers, interventions table, and charts for trends.",
      ]}
    />
  );
}
