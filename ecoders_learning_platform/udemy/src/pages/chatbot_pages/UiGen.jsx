import React from "react";
import UiGenAssistantShell from "./UiGenAssistantShell";

export default function UiGen() {
  return (
    <UiGenAssistantShell
      title="UI Generator"
      scope="ui-gen"
      placeholder="Describe the UI you want (e.g., 'Bootstrap login page with remember me + forgot password, modern spacing')…"
      starterPrompts={[
        "Generate an HTML About Us Page with a professional navbar, sections, and footer",
        "Create a About Us Page with a modern layout and clear sections",
        "Bootstrap account locked page with alert message and buttons to reset password or contact support.",
        "Admin Dashboard Page HTML (Bootstrap) design.",
        "Build a modern bootstrap Cart Page for an e-commerce app. Make it production-like.",
        "Create a bootstrap Checkout Page with clean UI, responsive layout, and realistic sections.",
        "Create a Tailwind Edit Profile page with a left sidebar, avatar upload, and Save/Cancel actions (design 1).",
        "Create a Account Settings Page page with modern UI, responsive layout, and clear actions. Design variation 1. Use bootstrap.",
        "Design a responsive Portfolio Page UI using clean spacing and components .",
        "Design a responsive Blog Detail Page UI using clean spacing and components .",
        "Generate an HTML Landing Page with a professional navbar, sections, and footer .",
        "Create a bootstrap Invoice Page with clean UI, responsive layout, and realistic sections.",
      ]}
    />
  );
}
