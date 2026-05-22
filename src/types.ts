export const GPA_GRADES = [
  'A+',
  'A',
  'A-',
  'B+',
  'B',
  'B-',
  'C+',
  'C',
  'D',
  'E/F',
] as const;

export const NON_GPA_GRADES = ['W', 'P', 'X', 'Y', 'I'] as const;

export type GpaGrade = (typeof GPA_GRADES)[number];
export type NonGpaGrade = (typeof NON_GPA_GRADES)[number];
export type Grade = GpaGrade | NonGpaGrade;

export type CompletedCourse = {
  id: string;
  name: string;
  semester: string;
  credits: number;
  grade: Grade;
};

export type CurrentCourse = {
  id: string;
  name: string;
  credits: number;
  percentage: number;
};

export type GradeScaleBand = {
  grade: GpaGrade;
  min: number;
  max: number;
};

export type GradePilotData = {
  completedCourses: CompletedCourse[];
  currentCourses: CurrentCourse[];
  percentageScale: GradeScaleBand[];
};
