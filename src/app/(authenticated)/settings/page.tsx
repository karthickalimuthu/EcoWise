import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2"><span className="gradient-text">Settings</span></h1>
      <p className="text-[var(--color-text-secondary)] mb-8">Manage your account preferences</p>
      <div className="glass-card p-12 text-center">
        <SettingsIcon className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold mb-2">Profile Settings</h2>
        <p className="text-[var(--color-text-muted)] max-w-md mx-auto">Account management features including profile editing, notification preferences, and data export will be available here.</p>
      </div>
    </div>
  );
}
