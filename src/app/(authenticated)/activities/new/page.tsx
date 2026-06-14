"use client";

/**
 * @module app/(authenticated)/activities/new
 * @description New activity form page with multi-step category selection.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Utensils,
  Zap,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const CATEGORIES = [
  {
    value: "TRANSPORT",
    label: "Transport",
    icon: Car,
    color: "text-sky-400 border-sky-400/20 bg-sky-400/5",
    subCategories: [
      { value: "car", label: "Car", unit: "km" },
      { value: "bus", label: "Bus", unit: "km" },
      { value: "train", label: "Train", unit: "km" },
      { value: "bike", label: "Bike", unit: "km" },
      { value: "flight_domestic", label: "Domestic Flight", unit: "km" },
      { value: "flight_international", label: "International Flight", unit: "km" },
    ],
  },
  {
    value: "FOOD",
    label: "Food",
    icon: Utensils,
    color: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    subCategories: [
      { value: "vegetarian", label: "Vegetarian", unit: "days" },
      { value: "mixed", label: "Mixed Diet", unit: "days" },
      { value: "high_meat", label: "High Meat", unit: "days" },
    ],
  },
  {
    value: "ENERGY",
    label: "Energy",
    icon: Zap,
    color: "text-violet-400 border-violet-400/20 bg-violet-400/5",
    subCategories: [
      { value: "electricity", label: "Electricity", unit: "kWh" },
      { value: "water", label: "Water", unit: "m³" },
    ],
  },
  {
    value: "SHOPPING",
    label: "Shopping",
    icon: ShoppingBag,
    color: "text-rose-400 border-rose-400/20 bg-rose-400/5",
    subCategories: [
      { value: "clothing", label: "Clothing", unit: "items" },
      { value: "electronics", label: "Electronics", unit: "items" },
    ],
  },
];

export default function NewActivityPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState({
    subCategory: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const category = CATEGORIES.find((c) => c.value === selectedCategory);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          subCategory: form.subCategory,
          value: parseFloat(form.value),
          date: new Date(form.date).toISOString(),
          notes: form.notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Failed to log activity");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/activities"), 1500);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in-up">
        <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold mb-2">Activity Logged! 🌱</h2>
        <p className="text-[var(--color-text-secondary)]">
          Redirecting to activities...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/activities"
          className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)] transition-colors"
          aria-label="Back to activities"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Log New Activity</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Step {step} of 2
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-emerald-500" : "bg-[var(--color-surface-tertiary)]"}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-emerald-500" : "bg-[var(--color-surface-tertiary)]"}`} />
      </div>

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <div className="fade-in-up">
          <h2 className="text-lg font-semibold mb-4">Select Category</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setForm((f) => ({ ...f, subCategory: "" }));
                }}
                className={`glass-card p-6 text-center transition-all ${
                  selectedCategory === cat.value
                    ? `border-emerald-400 ring-1 ring-emerald-400/20 ${cat.color}`
                    : ""
                }`}
                aria-pressed={selectedCategory === cat.value}
              >
                <cat.icon className={`w-8 h-8 mx-auto mb-2 ${cat.color.split(" ")[0]}`} aria-hidden="true" />
                <span className="font-medium">{cat.label}</span>
              </button>
            ))}
          </div>

          {category && (
            <>
              <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                Select Type
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {category.subCategories.map((sub) => (
                  <button
                    key={sub.value}
                    onClick={() => setForm((f) => ({ ...f, subCategory: sub.value }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      form.subCategory === sub.value
                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
                        : "border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                    }`}
                    aria-pressed={form.subCategory === sub.value}
                  >
                    {sub.label}
                    <span className="block text-xs opacity-60 mt-0.5">{sub.unit}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={!form.subCategory}
            className="btn-primary w-full py-3"
          >
            Continue
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && category && (
        <div className="fade-in-up">
          <h2 className="text-lg font-semibold mb-4">Activity Details</h2>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Value */}
            <div className="mb-4">
              <label htmlFor="value" className="input-label">
                Amount ({category.subCategories.find((s) => s.value === form.subCategory)?.unit ?? "units"})
              </label>
              <input
                id="value"
                type="number"
                step="0.1"
                min="0.1"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="input-field"
                placeholder="e.g. 15"
                required
                aria-required="true"
              />
            </div>

            {/* Date */}
            <div className="mb-4">
              <label htmlFor="date" className="input-label">Date</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field"
                required
                aria-required="true"
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label htmlFor="notes" className="input-label">Notes (optional)</label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field min-h-[80px] resize-y"
                placeholder="Any additional details..."
                maxLength={500}
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back
              </button>
              <button type="submit" className="btn-primary flex-1 py-3" disabled={loading} aria-busy={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <>Log Activity</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
