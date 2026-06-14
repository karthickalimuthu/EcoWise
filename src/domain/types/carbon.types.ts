/**
 * @module domain/types/carbon
 * @description Core type definitions for carbon footprint calculations.
 * Contains emission factors based on EPA and DEFRA data, category enums,
 * and calculation interfaces.
 */

// ──────────────────────────────────────────────
// Category Enums
// ──────────────────────────────────────────────

export const ActivityCategory = {
  TRANSPORT: "TRANSPORT",
  FOOD: "FOOD",
  ENERGY: "ENERGY",
  SHOPPING: "SHOPPING",
} as const;

export type ActivityCategory = (typeof ActivityCategory)[keyof typeof ActivityCategory];

export const TransportSubCategory = {
  CAR: "car",
  BUS: "bus",
  TRAIN: "train",
  BIKE: "bike",
  FLIGHT_DOMESTIC: "flight_domestic",
  FLIGHT_INTERNATIONAL: "flight_international",
} as const;

export type TransportSubCategory = (typeof TransportSubCategory)[keyof typeof TransportSubCategory];

export const FoodSubCategory = {
  VEGETARIAN: "vegetarian",
  MIXED: "mixed",
  HIGH_MEAT: "high_meat",
} as const;

export type FoodSubCategory = (typeof FoodSubCategory)[keyof typeof FoodSubCategory];

export const EnergySubCategory = {
  ELECTRICITY: "electricity",
  WATER: "water",
} as const;

export type EnergySubCategory = (typeof EnergySubCategory)[keyof typeof EnergySubCategory];

export const ShoppingSubCategory = {
  CLOTHING: "clothing",
  ELECTRONICS: "electronics",
} as const;

export type ShoppingSubCategory = (typeof ShoppingSubCategory)[keyof typeof ShoppingSubCategory];

export type SubCategory =
  | TransportSubCategory
  | FoodSubCategory
  | EnergySubCategory
  | ShoppingSubCategory;

// ──────────────────────────────────────────────
// Emission Factors (kg CO₂e per unit)
// Sources: EPA, DEFRA, IEA
// ──────────────────────────────────────────────

export interface EmissionFactor {
  readonly factor: number;
  readonly unit: string;
  readonly source: string;
}

export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // Transport (kg CO₂e per km)
  car: { factor: 0.21, unit: "km", source: "EPA avg passenger vehicle" },
  bus: { factor: 0.089, unit: "km", source: "DEFRA public bus" },
  train: { factor: 0.041, unit: "km", source: "DEFRA national rail" },
  bike: { factor: 0.0, unit: "km", source: "Zero emissions" },
  flight_domestic: { factor: 0.255, unit: "km", source: "DEFRA domestic flight" },
  flight_international: { factor: 0.195, unit: "km", source: "DEFRA long-haul flight" },

  // Food (kg CO₂e per day)
  vegetarian: { factor: 1.7, unit: "days", source: "Nature Food 2021" },
  mixed: { factor: 2.5, unit: "days", source: "Nature Food 2021" },
  high_meat: { factor: 3.3, unit: "days", source: "Nature Food 2021" },

  // Energy
  electricity: { factor: 0.233, unit: "kWh", source: "IEA global average" },
  water: { factor: 0.344, unit: "m3", source: "UK Water industry avg" },

  // Shopping (kg CO₂e per item)
  clothing: { factor: 15.0, unit: "items", source: "WRAP UK textile avg" },
  electronics: { factor: 50.0, unit: "items", source: "Apple Product Environmental Report avg" },
} as const;

// ──────────────────────────────────────────────
// Calculation Types
// ──────────────────────────────────────────────

export interface ActivityInput {
  readonly category: ActivityCategory;
  readonly subCategory: string;
  readonly value: number;
  readonly unit: string;
  readonly date: Date;
  readonly notes?: string;
}

export interface CalculationResult {
  readonly co2Amount: number;
  readonly category: ActivityCategory;
  readonly subCategory: string;
  readonly emissionFactor: EmissionFactor;
  readonly inputValue: number;
}

export interface CarbonSummary {
  readonly totalCo2: number;
  readonly byCategory: CategoryBreakdown[];
  readonly trend: TrendPoint[];
  readonly periodStart: Date;
  readonly periodEnd: Date;
}

export interface CategoryBreakdown {
  readonly category: ActivityCategory;
  readonly totalCo2: number;
  readonly percentage: number;
  readonly activityCount: number;
}

export interface TrendPoint {
  readonly date: string;
  readonly co2Amount: number;
  readonly label: string;
}

// ──────────────────────────────────────────────
// Simulation Types
// ──────────────────────────────────────────────

export interface SimulationInput {
  readonly currentActivities: ActivityInput[];
  readonly proposedChanges: ProposedChange[];
}

export interface ProposedChange {
  readonly subCategory: string;
  readonly newValue: number;
  readonly description: string;
}

export interface SimulationResult {
  readonly currentFootprint: number;
  readonly projectedFootprint: number;
  readonly reductionAmount: number;
  readonly reductionPercentage: number;
  readonly changeDetails: ChangeDetail[];
}

export interface ChangeDetail {
  readonly subCategory: string;
  readonly currentCo2: number;
  readonly projectedCo2: number;
  readonly savings: number;
  readonly description: string;
}

// ──────────────────────────────────────────────
// Unit mapping
// ──────────────────────────────────────────────

export const UNIT_MAP: Record<string, string> = {
  car: "km",
  bus: "km",
  train: "km",
  bike: "km",
  flight_domestic: "km",
  flight_international: "km",
  vegetarian: "days",
  mixed: "days",
  high_meat: "days",
  electricity: "kWh",
  water: "m3",
  clothing: "items",
  electronics: "items",
} as const;

export const CATEGORY_MAP: Record<string, ActivityCategory> = {
  car: ActivityCategory.TRANSPORT,
  bus: ActivityCategory.TRANSPORT,
  train: ActivityCategory.TRANSPORT,
  bike: ActivityCategory.TRANSPORT,
  flight_domestic: ActivityCategory.TRANSPORT,
  flight_international: ActivityCategory.TRANSPORT,
  vegetarian: ActivityCategory.FOOD,
  mixed: ActivityCategory.FOOD,
  high_meat: ActivityCategory.FOOD,
  electricity: ActivityCategory.ENERGY,
  water: ActivityCategory.ENERGY,
  clothing: ActivityCategory.SHOPPING,
  electronics: ActivityCategory.SHOPPING,
} as const;
