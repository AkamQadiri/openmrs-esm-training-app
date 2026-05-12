import { type User } from './common';
import { type Exercise } from './exercise';
import { type Lesson } from './lesson';

export enum ModuleType {
  LESSON = 'LESSON',
  EXERCISE = 'EXERCISE',
}

export interface Course {
  uuid: string;
  name: string;
  description?: string;
  estimatedMinutes?: number;
  version?: number;
  published?: boolean;
  dateCreated?: string;
  retired?: boolean;
  creator?: User;
}

export interface CourseModule {
  uuid: string;
  course: Course;
  moduleType: ModuleType;
  lesson?: Lesson;
  exercise?: Exercise;
  sortWeight: number;
  required: boolean;
  dateCreated?: string;
  retired?: boolean;
  creator?: User;
}

export interface CourseStructure {
  uuid: string;
  name: string;
  description?: string;
  estimatedMinutes?: number;
  version?: number;
  published?: boolean;
  modules: CourseModule[];
}

export interface CourseFeedback {
  clarityRating: number;
  difficultyRating: number;
  usefulnessRating: number;
  overallRating: number;
  comment?: string;
}
