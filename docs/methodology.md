# Carbon Calculation Methodology

EcoWise AI uses standardized emission factors to estimate the carbon footprint of daily activities. The factors are sourced from established environmental protection agencies and scientific literature to ensure credibility and accuracy.

## Emission Factors

The following emission factors are used as baselines within the platform. All values are represented in **kg CO₂e** (Carbon Dioxide Equivalent).

### Transportation (per km)
*   **Car (Average Petrol/Diesel):** 0.192 kg CO₂e / km
*   **Bus (Local):** 0.105 kg CO₂e / km
*   **Train (National Rail):** 0.041 kg CO₂e / km
*   **Flight (Domestic, <1000km):** 0.255 kg CO₂e / km
*   **Flight (International):** 0.150 kg CO₂e / km
*   **Bicycle / Walking:** 0 kg CO₂e / km

### Food & Diet (per day)
*   **High Meat (100g+ per day):** 7.19 kg CO₂e / day
*   **Medium Meat (50-100g per day):** 5.63 kg CO₂e / day
*   **Low Meat (<50g per day):** 4.67 kg CO₂e / day
*   **Vegetarian:** 3.81 kg CO₂e / day
*   **Vegan:** 2.89 kg CO₂e / day

### Home Energy
*   **Electricity (Grid Average):** 0.385 kg CO₂e / kWh
*   **Natural Gas:** 0.183 kg CO₂e / kWh

### Shopping & Consumer Goods (per item estimate)
*   **Clothing (Fast Fashion Garment):** ~15 kg CO₂e / item
*   **Electronics (Smartphone):** ~70 kg CO₂e / item
*   **Electronics (Laptop):** ~250 kg CO₂e / item

## Calculation Engine

The platform aggregates these values dynamically. When a user inputs an activity (e.g., 50km driven in a car), the engine applies the specific factor:
`50 km * 0.192 kg CO₂e/km = 9.6 kg CO₂e`

## References
1. EPA (Environmental Protection Agency) - Greenhouse Gas Equivalencies Calculator
2. DEFRA (Department for Environment, Food & Rural Affairs, UK) - Conversion Factors 2023
3. IPCC (Intergovernmental Panel on Climate Change) - Assessment Reports
