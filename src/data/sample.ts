import type { PlanInput } from './plan';

/** All values are fictional demo data, not real user or medical data. */
export const sampleProfile = {
  healthJourney: 'Hormone Optimization',
  regularCycles: false,
  lastPeriodStart: '2026-11-03',
  typicalBleedDays: 5,
  usualScanTime: '8:00 AM',
} as const;

export const samplePlanInput: PlanInput = {
  startDate: sampleProfile.lastPeriodStart,
  lengthDays: 30,
  lastPeriodStart: sampleProfile.lastPeriodStart,
  typicalBleedDays: sampleProfile.typicalBleedDays,
};

/** Illustrative chart percentages for the demo's reveal animation. */
export const sampleHormoneScans = [
  { date: '2026-11-03', lh: 18, pdg: 8, e3g: 30 },
  { date: '2026-11-04', lh: 22, pdg: 10, e3g: 38 },
  { date: '2026-11-05', lh: 25, pdg: 12, e3g: 46 },
  { date: '2026-11-06', lh: 34, pdg: 11, e3g: 58 },
  { date: '2026-11-07', lh: 62, pdg: 15, e3g: 72 },
  { date: '2026-11-08', lh: 88, pdg: 22, e3g: 64 },
  { date: '2026-11-09', lh: 41, pdg: 38, e3g: 48 },
  { date: '2026-11-10', lh: 24, pdg: 54, e3g: 44 },
] as const;

export const unlockRules = {
  chartScans: 3,
  reportScans: 4,
  testTimerSeconds: 600,
} as const;
