import type { CompletedCourse, CurrentCourse, GradeScaleBand } from '../types';

export const DEFAULT_PERCENTAGE_SCALE: GradeScaleBand[] = [
  { grade: 'A+', min: 97, max: 100 },
  { grade: 'A', min: 93, max: 96 },
  { grade: 'A-', min: 90, max: 92 },
  { grade: 'B+', min: 87, max: 89 },
  { grade: 'B', min: 83, max: 86 },
  { grade: 'B-', min: 80, max: 82 },
  { grade: 'C+', min: 77, max: 79 },
  { grade: 'C', min: 70, max: 76 },
  { grade: 'D', min: 60, max: 69 },
  { grade: 'E/F', min: 0, max: 59 },
];

export const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `course-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const createCompletedCourse = (): CompletedCourse => ({
  id: createId(),
  name: '',
  semester: '',
  credits: 3,
  grade: 'A',
});

export const createCurrentCourse = (): CurrentCourse => ({
  id: createId(),
  name: '',
  credits: 3,
  percentage: 90,
});
