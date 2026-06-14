import { Leaf, FileText } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Carbon <span className="gradient-text">Reports</span></h1>
      <p className="text-[var(--color-text-secondary)] mb-8">Detailed carbon footprint analysis and reporting</p>
      <div className="glass-card p-12 text-center">
        <FileText className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold mb-2">Reports are generated from your activity data</h2>
        <p className="text-[var(--color-text-muted)] mb-4 max-w-md mx-auto">Log at least 2 weeks of activities to generate comprehensive carbon reports with trends and insights.</p>
        <Link href="/dashboard" className="btn-primary"><Leaf className="w-4 h-4" aria-hidden="true" />Go to Dashboard</Link>
      </div>
    </div>
  );
}
