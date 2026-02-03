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
        "Make a college student dashboard showing attendance, GPA, fees status, and at-risk students. Use Bootstrap.",

        "Create a Bootstrap admin dashboard for student analytics with department summary and top performers table.",

        "Bootstrap HTML dashboard for student performance. Keep it simple with KPI cards and a table.",

        "Bootstrap dashboard for hostel students: fee dues, mess attendance, and discipline alerts.",

        "Generate a Bootstrap student analytics page with filters (department + semester) and results table.",

        "Need a Tailwind CSS dashboard for college students: KPIs, at-risk list, and a clean table. Use Tailwind CDN.",

        "Design a Tailwind fee + attendance monitoring dashboard with filters, table, and bulk reminder action.",

        "Generate a Tailwind dashboard for a school with class-wise attendance, top students, and alerts.",

        "Make a modern Tailwind dashboard with GPA trend placeholder and at-risk rule text.",

        "Tailwind dashboard: show timetable, next exam, attendance, assignments due, and a student table.",

        "Give me a plain HTML+CSS dashboard for student tracking (no bootstrap, no tailwind). Add cards + table.",

        "Create HTML+CSS dashboard for a school focusing on class attendance, fee dues, and notices. No frameworks.",

        "Make a minimal HTML dashboard highlighting top performers and at-risk with badges (no frameworks).",

        "Bootstrap dashboard for placement readiness: skills progress, mock scores, attendance, GPA, and student table.",

        "Tailwind dashboard for college: department-wise cards, fee status distribution, and at-risk list. Make it modern.",
      ]}
    />
  );
}
