import { DEFAULT_PERCENTAGE_SCALE } from '../data/defaults';
import type { GradePilotData } from '../types';

const STORAGE_KEY = 'gradepilot.data.v1';

export const emptyGradePilotData = (): GradePilotData => ({
  completedCourses: [],
  currentCourses: [],
  percentageScale: DEFAULT_PERCENTAGE_SCALE.map((band) => ({ ...band })),
});

export const loadGradePilotData = () => {
  if (typeof window === 'undefined') {
    return emptyGradePilotData();
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return emptyGradePilotData();
    }

    const data = JSON.parse(saved) as Partial<GradePilotData>;

    return {
      completedCourses: Array.isArray(data.completedCourses)
        ? data.completedCourses
        : [],
      currentCourses: Array.isArray(data.currentCourses)
        ? data.currentCourses
        : [],
      percentageScale:
        Array.isArray(data.percentageScale) && data.percentageScale.length > 0
          ? data.percentageScale
          : DEFAULT_PERCENTAGE_SCALE.map((band) => ({ ...band })),
    };
  } catch {
    return emptyGradePilotData();
  }
};

export const saveGradePilotData = (data: GradePilotData) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const clearGradePilotData = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};
