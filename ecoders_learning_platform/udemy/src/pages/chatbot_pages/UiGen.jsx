import React from "react";
import UiGenAssistantShell from "./UiGenAssistantShell";

export default function UiGen() {
  return (
    <UiGenAssistantShell
      title="UI Generator"
      scope="ui-gen"
      placeholder="Describe the UI you want (e.g., 'Responsive pricing table with 3 tiers and CTA')…"
      starterPrompts={[
        "Landing page hero section with headline, subtext, and email signup form.",
        "Dashboard layout with sidebar navigation, top bar, and cards grid.",
        "Product card component with image, title, price, rating stars, and add-to-cart.",
        "Multi-step signup form with progress indicator and validation messages.",
        "Sticky navbar with dropdown menu and smooth scrolling anchors.",
        "Responsive pricing table (3 tiers) with highlighted 'Pro' plan.",
        "Modal dialog with form fields and keyboard-accessible controls.",
        "Data table with search, sort, pagination, and empty-state message.",
      ]}
    />
  );
}
