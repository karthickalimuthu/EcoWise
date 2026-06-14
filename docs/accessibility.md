# Accessibility Statement

EcoWise AI is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.

## Conformance Status

The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. EcoWise AI is designed to be **fully conformant with WCAG 2.1 level AAA** in critical flows.

## Implemented Accessibility Features

### 1. Keyboard Navigation
- A hidden "Skip to content" link is implemented at the top of the DOM to allow keyboard and screen-reader users to bypass repetitive navigation.
- All interactive elements (buttons, inputs, links) possess distinct, high-contrast `:focus-visible` states.
- The tab order is strictly logical, following the visual flow of the page.

### 2. Semantic HTML & ARIA
- Complex UI components (e.g., the Activity Logging multi-step selection grid) abandon native `<select>` tags for highly customized button grids. To maintain accessibility, these grids strictly implement `role="radiogroup"` and `role="radio"` with `aria-checked` states.
- Icons from `lucide-react` are marked with `aria-hidden="true"` to prevent screen readers from announcing decorative elements.

### 3. Visual Contrast
- We avoided low-contrast "aesthetic" grays. The primary muted text color is `#8bb09f` on a very dark `#111916` background, comfortably passing the WCAG AAA 7:1 contrast ratio requirement for normal text.

## Continuous Testing
We utilize automated Axe-core scanning during our CI/CD pipeline to mathematically verify that zero critical or serious accessibility violations are introduced into the production branch.
