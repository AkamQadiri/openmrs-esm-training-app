import { type User } from './common';
import { type ModuleType, type Course } from './course';

export interface CourseEnrollment {
  uuid: string;
  user: User;
  course: Course;
  enrolledAt: string;
  completedAt?: string;
  lastAccessedAt?: string;
  progressPercentage: number;
  lastAccessedModule?: CourseEnrollmentModule;
  nextModule?: CourseEnrollmentModule;
}

export interface CourseEnrollmentModule {
  uuid: string;
  moduleType: ModuleType;
  sortWeight: string;
  lessonUuid?: string;
  exerciseUuid?: string;
}
