import React from "react";
import DashboardGenAssistantShell from "../chatbot_pages/DashboardGenAssistantShell";

export default function DashboardGenerator() {
  return (
    <DashboardGenAssistantShell
      title="Dashboard Generator"
      scope="dashboard-gen"
      placeholder="Describe the dashboard you want (e.g., 'MBA student dashboard with credits/cgpa + fee table')…"
      defaultMaxNewTokens={700}
      defaultMaxTimeS={60}
      starterPrompts={[
        "Create a React component student dashboard for a MBA student. Show KPIs for credits and cgpa, plus a table for fees. Use Tailwind. Keep it compact.",
        "Build a college dashboard React JSX for a MBA student with sections: Overview KPIs, Trends, and Alerts. Use Tailwind. Use mock data inside the component. Include timetable, credits, fees.",
        "Generate a React JSX dashboard for a college student (BCom). Include: credits, assignments, discipline points. Use Tailwind. Add 2 small charts (simple SVG/HTML bars).",
        "Create a React component student dashboard for a college student (BCom). Show KPIs for fees and club activity, plus a table for gpa. Use Tailwind. Keep it compact",
        "Build a college dashboard React JSX for a school student (Class 10) with sections: Overview KPIs, Trends, and Alerts. Use Tailwind. Use mock data inside the component. Include cgpa, fees, discipline points.",
      ]}
    />
  );
}
