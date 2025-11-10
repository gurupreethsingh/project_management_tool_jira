// src/pages/ai_pages/DashboardGenerator.jsx

import React from "react";
import DashboardGenAssistantShell from "../chatbot_pages/DashboardGenAssistantShell";

export default function DashboardGenerator() {
  return (
    <DashboardGenAssistantShell
      title="Dashboard Generator"
      scope="dashboard-gen"
      placeholder="Describe the dashboard you want (e.g., 'Student performance dashboard with GPA trends, attendance, risk alerts, and filters by semester')…"
      starterPrompts={[
        "Design a student performance dashboard with GPA trends, attendance heatmap, and at-risk alerts.",
        "E-commerce admin dashboard showing revenue, orders, conversion funnel, and top products.",
        "LMS analytics dashboard with course completion, active learners, and engagement by module.",
        "QA / bug-tracking dashboard with open vs closed issues, severity distribution, and sprint burndown.",
        "HR dashboard with headcount, attrition rate, hiring pipeline, and diversity metrics.",
        "Finance dashboard with MRR, churn, cash runway, and expense breakdown.",
      ]}
    />
  );
}
