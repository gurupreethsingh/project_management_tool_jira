// components/dashboard/DashboardLayout.jsx
export default function DashboardLayout({ left, right }) {
  return (
    // inside DashboardLayout render
    <div className="flex gap-6">
      <aside className="w-full lg:w-64 min-h-0">
        {" "}
        {/* add min-h-0 here */}
        {left}
      </aside>
      <main className="flex-1 min-h-0">{right}</main> {/* good practice */}
    </div>
  );
}
