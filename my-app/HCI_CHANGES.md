# HCI Change Log (Detailed)

This document lists the UI/UX and functional changes made since the original repo, mapped to the relevant HCI principles.

## 1) Overall Visual System
- Typography refreshed with expressive display and body fonts to create clearer hierarchy and scanability.
  - HCI: Aesthetic and Minimalist Design, Visual Hierarchy.
- Background updated with a soft gradient and a subtle grid texture to add depth without distracting the task flow.
  - HCI: Aesthetic and Minimalist Design, Figure-Ground.
- Focus states strengthened to make keyboard navigation obvious.
  - HCI: Visibility of System Status, Accessibility.
- Motion reduced for users who prefer reduced motion.
  - HCI: User Control and Freedom, Accessibility.

## 2) Navigation and Information Architecture
- Top-level navigation reduced to primary tasks (Book, Manage, Holidays, Help) to reduce choice overload.
  - HCI: Hick's Law (fewer options), Minimalist Design.
- "More" menu added as progressive disclosure to keep secondary links available but not dominant.
  - HCI: Progressive Disclosure, Hick's Law.
- Dropdown stacking fixed to ensure visibility over the hero section.
  - HCI: Visibility of System Status.

## 3) Hero Area and Primary Task Focus
- Hero content redesigned with clearer hierarchy, trust badges, and status messaging.
  - HCI: Visibility of System Status, Match with Real World.
- Booking widget visually separated from the background image using layered overlays.
  - HCI: Gestalt Figure-Ground.
- Primary CTA has emphasis with color, size, and subtle sheen.
  - HCI: Visual Hierarchy, Fitts's Law (target prominence).

## 4) Booking Widget (Core Task Flow)
- Tabs styled as a single grouped control to signal shared context.
  - HCI: Gestalt Law of Common Region.
- Progressive disclosure added for advanced options (Class, Quota) to simplify the first decision step.
  - HCI: Hick's Law, Minimalist Design.
- Form validation and inline status feedback added to reduce uncertainty.
  - HCI: Visibility of System Status, Error Prevention.
- Popular routes surfaced as one-tap shortcuts.
  - HCI: Efficiency of Use, Fitts's Law.
- Station autocomplete replaced default browser dropdown with a custom suggestion list.
  - HCI: Match with Real World, Aesthetic and Minimalist Design, Error Prevention.

## 5) Quick Actions and Services
- Quick actions added for high-frequency tasks with large targets and short descriptions.
  - HCI: Fitts's Law, Recognition over Recall.
- Services list uses progressive disclosure (show fewer vs show all).
  - HCI: Hick's Law, Progressive Disclosure.
- Cards use consistent iconography and spacing for clearer grouping.
  - HCI: Gestalt Law of Similarity.

## 6) Search Results (Train Discovery)
- Search results remain minimal until a class is selected, then expand with availability.
  - HCI: Progressive Disclosure, Hick's Law.
- Date cards and booking CTAs are sized and spaced for quick selection.
  - HCI: Fitts's Law.
- Popular routes now generate availability for any selected date.
  - HCI: System Responsiveness, Match with User Expectations.

## 7) Accessibility Features
- Floating accessibility widget added to adjust font size globally.
  - HCI: Flexibility and Efficiency of Use, Accessibility.
- Skip link added for faster keyboard navigation to the booking section.
  - HCI: Accessibility, Efficiency of Use.

## 8) Motion and Micro-Interactions
- Page-load and section reveals use gentle staggered animations.
  - HCI: Visibility of System Status, Aesthetic and Minimalist Design.
- Hover and focus transitions applied to links and cards for clearer affordance.
  - HCI: Feedback, Visibility of System Status.

## 9) Backend and Data Flow (Dummy Data)
- Added an internal API route to serve dashboard data to the UI.
  - HCI: System Status, Consistency.
- Frontend now consumes data for alerts, hero, services, stats, offers, and FAQs.
  - HCI: Consistency and Standards, Match with Real World.

## 10) Mapping to HCI Sources
- The changes reflect principles discussed in the provided PDFs:
  - Hick's Law: fewer visible choices, progressive menus.
  - Fitts's Law: larger, clearer targets for primary actions.
  - Figure-Ground and Similarity (Gestalt): stronger grouping and separation.
  - Visibility of System Status: clear feedback and progress cues.
  - Accessibility and flexibility: font-size control and focus indicators.
