import { type User } from './common';

export interface CourseAnalytics {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgress: number;
  completionRate: number;
  exerciseStatistics: ExerciseStatistics[];
  feedbackSummary: FeedbackSummary;
}

export interface UserAnalytics {
  user?: User;
  totalCoursesEnrolled: number;
  coursesCompleted: number;
  coursesInProgress: number;
  overallProgress: number;
  courseDetails: CourseDetail[];
}

export interface ExerciseStatistics {
  exerciseName: string;
  exerciseType: string;
  totalAttempts: number;
  uniqueUsers: number;
  successRate: number;
  averageAttemptsPerUser: number;
  averageTimeSpentMinutes: number;
}

export interface FeedbackSummary {
  totalResponses: number;
  averageClarityRating: number;
  averageDifficultyRating: number;
  averageUsefulnessRating: number;
  averageOverallRating: number;
  comments: string[];
}

export interface CourseDetail {
  courseName: string;
  enrolledAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  progressPercentage: number;
}
