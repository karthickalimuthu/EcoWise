import { ActivityCategory } from "@/domain/types/carbon.types";
import type { ProfileType } from "@/domain/types/user.types";

export interface RecommendationTemplate {
  readonly category: ActivityCategory;
  readonly title: string;
  readonly description: string;
  readonly reasoningTemplate: string;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly impact: "LOW" | "MEDIUM" | "HIGH";
  readonly baseReduction: number; // % reduction estimate
  readonly applicableTo: string[]; // sub-categories this applies to
  readonly profileBoost: ProfileType[]; // profiles that get higher priority
}

export const RECOMMENDATION_TEMPLATES: RecommendationTemplate[] = [
  // ── Transport ──
  {
    category: ActivityCategory.TRANSPORT,
    title: "Switch to public transport for daily commute",
    description: "Replace 3+ car trips per week with bus or train. This can significantly reduce your transport emissions while saving on fuel costs.",
    reasoningTemplate: "Your transportation accounts for {percentage}% of your total footprint. Switching from car to public transport reduces per-km emissions by up to 76%.",
    difficulty: "MEDIUM",
    impact: "HIGH",
    baseReduction: 25,
    applicableTo: ["car"],
    profileBoost: ["PROFESSIONAL", "STUDENT"],
  },
  {
    category: ActivityCategory.TRANSPORT,
    title: "Cycle or walk for short trips",
    description: "For distances under 5km, consider cycling or walking instead of driving. It's healthier and produces zero emissions.",
    reasoningTemplate: "Many of your car trips may be under 5km. Replacing these with cycling eliminates {amount} kg CO₂e from those trips entirely.",
    difficulty: "EASY",
    impact: "MEDIUM",
    baseReduction: 15,
    applicableTo: ["car"],
    profileBoost: ["STUDENT", "ENTHUSIAST"],
  },
  {
    category: ActivityCategory.TRANSPORT,
    title: "Choose trains over domestic flights",
    description: "For routes under 500km, train travel produces 84% less CO₂ than flying. Consider booking rail tickets for your next domestic trip.",
    reasoningTemplate: "Your domestic flights produce {amount} kg CO₂e. A train for the same distance would produce only {reduced} kg CO₂e.",
    difficulty: "MEDIUM",
    impact: "HIGH",
    baseReduction: 30,
    applicableTo: ["flight_domestic"],
    profileBoost: ["PROFESSIONAL"],
  },
  {
    category: ActivityCategory.TRANSPORT,
    title: "Reduce international flights by one per year",
    description: "A single transatlantic flight can produce over 1,600 kg CO₂e. Consider virtual meetings or combining trips to reduce frequency.",
    reasoningTemplate: "International flights are your highest single-event emission source at {amount} kg CO₂e per trip.",
    difficulty: "HARD",
    impact: "HIGH",
    baseReduction: 20,
    applicableTo: ["flight_international"],
    profileBoost: ["PROFESSIONAL", "ENTHUSIAST"],
  },

  // ── Food ──
  {
    category: ActivityCategory.FOOD,
    title: "Add 2 vegetarian days per week",
    description: "Meat production is carbon-intensive. Having 2 meat-free days per week can reduce your food-related emissions by up to 25%.",
    reasoningTemplate: "Your food emissions are {amount} kg CO₂e/month. Plant-based meals produce 47% less CO₂ than high-meat diets.",
    difficulty: "EASY",
    impact: "MEDIUM",
    baseReduction: 20,
    applicableTo: ["high_meat", "mixed"],
    profileBoost: ["FAMILY", "ENTHUSIAST"],
  },
  {
    category: ActivityCategory.FOOD,
    title: "Transition to a predominantly plant-based diet",
    description: "A fully vegetarian diet can cut food emissions by nearly 50% compared to a high-meat diet. Start with one meal at a time.",
    reasoningTemplate: "Switching from high-meat ({current} kg CO₂e/day) to vegetarian ({target} kg CO₂e/day) saves {savings} kg CO₂e daily.",
    difficulty: "HARD",
    impact: "HIGH",
    baseReduction: 40,
    applicableTo: ["high_meat"],
    profileBoost: ["ENTHUSIAST"],
  },
  {
    category: ActivityCategory.FOOD,
    title: "Reduce food waste",
    description: "Plan meals ahead, use leftovers creatively, and compost organic waste. Food waste accounts for 8-10% of global greenhouse gas emissions.",
    reasoningTemplate: "Reducing food waste by 30% could save approximately {amount} kg CO₂e per month from your food footprint.",
    difficulty: "EASY",
    impact: "LOW",
    baseReduction: 10,
    applicableTo: ["vegetarian", "mixed", "high_meat"],
    profileBoost: ["FAMILY", "STUDENT"],
  },

  // ── Energy ──
  {
    category: ActivityCategory.ENERGY,
    title: "Switch to LED lighting throughout your home",
    description: "LED bulbs use 75% less energy than incandescent bulbs and last 25 times longer. Replace all conventional bulbs with LED alternatives.",
    reasoningTemplate: "Lighting accounts for approximately 12% of home electricity. Switching to LEDs can save {amount} kg CO₂e monthly.",
    difficulty: "EASY",
    impact: "LOW",
    baseReduction: 10,
    applicableTo: ["electricity"],
    profileBoost: ["FAMILY", "STUDENT"],
  },
  {
    category: ActivityCategory.ENERGY,
    title: "Reduce standby power consumption",
    description: "Turn off devices completely instead of leaving them on standby. Use smart power strips to eliminate phantom loads.",
    reasoningTemplate: "Standby power can account for 5-10% of household electricity use, costing you approximately {amount} kg CO₂e monthly.",
    difficulty: "EASY",
    impact: "LOW",
    baseReduction: 8,
    applicableTo: ["electricity"],
    profileBoost: ["FAMILY"],
  },
  {
    category: ActivityCategory.ENERGY,
    title: "Reduce shower time by 2 minutes",
    description: "Shorter showers save both water and the energy needed to heat it. A 2-minute reduction per shower saves approximately 25 liters per shower.",
    reasoningTemplate: "Your water usage of {amount} m³ contributes {co2} kg CO₂e. Reducing by 15% through shorter showers saves {savings} kg CO₂e.",
    difficulty: "EASY",
    impact: "LOW",
    baseReduction: 12,
    applicableTo: ["water"],
    profileBoost: ["FAMILY", "STUDENT"],
  },

  // ── Shopping ──
  {
    category: ActivityCategory.SHOPPING,
    title: "Buy second-hand clothing",
    description: "Second-hand fashion has nearly zero additional carbon footprint. Try thrift stores, clothing swaps, or online resale platforms.",
    reasoningTemplate: "Each new clothing item produces about 15 kg CO₂e. You purchased {count} items, generating {amount} kg CO₂e. Second-hand alternatives save nearly 100%.",
    difficulty: "EASY",
    impact: "MEDIUM",
    baseReduction: 30,
    applicableTo: ["clothing"],
    profileBoost: ["STUDENT", "ENTHUSIAST"],
  },
  {
    category: ActivityCategory.SHOPPING,
    title: "Extend electronics lifespan by 1 year",
    description: "Keep your devices for at least one extra year before upgrading. Repair instead of replace. A single smartphone produces about 70 kg CO₂e to manufacture.",
    reasoningTemplate: "Your electronics purchases contribute {amount} kg CO₂e. Extending device lifespan by 1 year reduces annualized emissions by approximately 25%.",
    difficulty: "MEDIUM",
    impact: "HIGH",
    baseReduction: 25,
    applicableTo: ["electronics"],
    profileBoost: ["PROFESSIONAL", "STUDENT"],
  },
];
