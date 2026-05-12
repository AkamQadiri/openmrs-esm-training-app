import { type User } from './common';
import { type CourseEnrollment } from './enrollment';
import { type LocalizedText } from './localization';

export interface Exercise {
  uuid: string;
  name: string;
  exerciseType: ExerciseType;
  content?: ExerciseContent;
  allowRetry?: boolean;
  dateCreated?: string;
  retired?: boolean;
  creator?: User;
}

export interface ExerciseAttempt {
  uuid: string;
  exercise: Exercise;
  enrollment: CourseEnrollment;
  attemptNumber: number;
  response?: object;
  correct?: boolean;
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds?: number;
  status: ExerciseAttemptStatus;
  feedback?: ExerciseAttemptFeedback;
  allowRetry?: boolean;
}

export interface ExerciseAttemptFeedback {
  message?: string;
  error?: string;
}

export enum ExerciseType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  MATCHING = 'MATCHING',
  ORDERING = 'ORDERING',
  CONCEPT_CREATION = 'CONCEPT_CREATION',
  FORM_CREATION = 'FORM_CREATION',
}

export enum ExerciseAttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface BaseExerciseContent {
  instructions?: LocalizedText;
  hint?: LocalizedText;
}

export interface MultipleChoiceContent extends BaseExerciseContent {
  question: LocalizedText;
  options: MultipleChoiceOption[];
}

export interface MultipleChoiceOption {
  id: string;
  text: LocalizedText;
}

export interface TrueFalseContent extends BaseExerciseContent {
  statement: LocalizedText;
}

export interface FillInBlankContent extends BaseExerciseContent {
  text: LocalizedText;
  options: LocalizedText[];
}

export interface MatchingContent extends BaseExerciseContent {
  leftItems: MatchingItem[];
  rightItems: MatchingItem[];
}

export interface MatchingItem {
  id: string;
  text: LocalizedText;
}

export interface OrderingContent extends BaseExerciseContent {
  items: OrderingItem[];
}

export interface OrderingItem {
  id: string;
  text: LocalizedText;
}

export interface ConceptCreationContent extends BaseExerciseContent {
  requirements: ConceptRequirements;
}

export interface ConceptRequirements {
  name?: {
    primary?: LocalizedText;
    synonyms?: LocalizedText[];
    searchTerms?: LocalizedText[];
    shortName?: LocalizedText;
  };
  description?: LocalizedText;
  class?: string;
  isSet?: boolean;
  setMembers?: Array<{
    conceptName?: LocalizedText;
  }>;
  datatype?: string;
  numericProperties?: {
    hiAbsolute?: number;
    hiCritical?: number;
    hiNormal?: number;
    lowAbsolute?: number;
    lowCritical?: number;
    lowNormal?: number;
    units?: string;
    allowDecimal?: boolean;
    displayPrecision?: number;
  };
  codedProperties?: Array<{
    conceptName: LocalizedText;
  }>;
  mappings?: Array<{
    relationship: string;
    source: string;
    code: string;
  }>;
  version?: string;
}

export interface FormCreationContent extends BaseExerciseContent {
  requirements: FormRequirements;
  hint?: LocalizedText;
}

export interface FormRequirements {
  name: LocalizedText;
  description: LocalizedText;
  version: string;
  encounterType: string;
  published?: boolean;
  pages: FormPage[];
}

export interface FormPage {
  label: LocalizedText;
  sections: FormSection[];
}

export interface FormSection {
  label: LocalizedText;
  isExpanded?: boolean;
  questions: FormQuestion[];
}

export interface FormQuestion {
  id: LocalizedText;
  label: LocalizedText;
  required?: boolean;
  type: string;
  questionOptions: FormQuestionOptions;
}

export interface FormQuestionOptions {
  rendering: string;
  concept: {
    id: string;
    name: LocalizedText;
  };
  min: string;
  max: string;
}

// Union type for all exercise content types
export type ExerciseContent =
  | MultipleChoiceContent
  | TrueFalseContent
  | FillInBlankContent
  | MatchingContent
  | OrderingContent
  | ConceptCreationContent
  | FormCreationContent;
