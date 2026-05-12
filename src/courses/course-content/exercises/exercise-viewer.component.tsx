import { Button, InlineNotification } from '@carbon/react';
import { showToast } from '@openmrs/esm-framework';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExercise } from '../../../resources/exercise.resource';
import {
  type BaseExerciseContent,
  type CourseEnrollment,
  type ExerciseAttemptFeedback,
  ExerciseType,
  Representation,
} from '../../../types';
import MultipleChoice from './multiple-choice.component';
import { startExerciseAttempt, submitExerciseAttempt } from '../../../resources/attempt.resource';
import { getLocalizedText } from '../../../utils/helpers';
import TrueFalse from './true-false.component';
import FillInBlank from './fill-in-blank.component';
import Matching from './matching.component';
import Ordering from './ordering.component';
import ConceptCreation from './concept-creation.component';
import FormCreation from './form-creation.component';
import { AsyncContent } from '../../../components';
import styles from './exercise-viewer.scss';

interface ExerciseViewerProps {
  exerciseUuid: string;
  enrollment: CourseEnrollment;
  mutateEnrollment: () => void;
}

const ExerciseViewer: React.FC<ExerciseViewerProps> = ({ exerciseUuid, enrollment, mutateEnrollment }) => {
  const { t, i18n } = useTranslation();
  const [response, setResponse] = useState(null);
  const [feedback, setFeedback] = useState<ExerciseAttemptFeedback>(null);
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { exercise, isLoading: isExerciseLoading } = useExercise(exerciseUuid, Representation.FULL);

  useEffect(() => {
    setResponse(null);
    setFeedback(null);
    setHasFailedAttempt(false);
    setIsSubmitting(false);
    setIsStarted(false);
    setIsCompleted(false);
  }, [exerciseUuid]);

  const handleStartExercise = useCallback(async () => {
    setIsStarted(false);
    try {
      await startExerciseAttempt(enrollment.uuid, exercise.uuid);
      setIsStarted(true);
    } catch (error) {
      console.error('Failed to start exercise attempt:', error);
      showToast({
        title: t('error'),
        description: t('failedToStartExercise'),
        kind: 'error',
      });
    }
  }, [exercise?.uuid, enrollment?.uuid, t]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const attemptResponse = await submitExerciseAttempt(exercise.uuid, enrollment.uuid, response);

      if (attemptResponse.data.correct) {
        setFeedback(attemptResponse.data.feedback);
        setHasFailedAttempt(false);
        setIsCompleted(true);
        return mutateEnrollment();
      }

      setFeedback(attemptResponse.data.feedback);
      setHasFailedAttempt(true);
      setIsStarted(!attemptResponse.data.allowRetry);
      setResponse(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('failedToSubmitExercise');

      showToast({
        title: t('error'),
        description: errorMessage,
        kind: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [exercise?.uuid, enrollment?.uuid, response, mutateEnrollment, t]);

  const renderExercise = () => {
    switch (exercise.exerciseType) {
      case ExerciseType.MULTIPLE_CHOICE:
        return <MultipleChoice exercise={exercise} onChoiceChanged={setResponse} disabled={isCompleted} />;
      case ExerciseType.TRUE_FALSE:
        return <TrueFalse exercise={exercise} onChoiceChanged={setResponse} disabled={isCompleted} />;
      case ExerciseType.FILL_IN_BLANK:
        return <FillInBlank exercise={exercise} onChoiceChanged={setResponse} disabled={isCompleted} />;
      case ExerciseType.MATCHING:
        return <Matching exercise={exercise} onChoiceChanged={setResponse} disabled={isCompleted} />;
      case ExerciseType.ORDERING:
        return <Ordering exercise={exercise} onChoiceChanged={setResponse} disabled={isCompleted} />;
      case ExerciseType.CONCEPT_CREATION:
        return <ConceptCreation exercise={exercise} onChoiceChanged={setResponse} disabled={isCompleted} />;
      case ExerciseType.FORM_CREATION:
        return <FormCreation exercise={exercise} onChoiceChanged={setResponse} disabled={isCompleted} />;
      default:
        return <p className={styles.unknownType}>{t('unknownExerciseType', { type: exercise.exerciseType })}</p>;
    }
  };

  const content = exercise?.content as BaseExerciseContent;
  const hint = content?.hint ? getLocalizedText(i18n.language, content.hint) : null;

  return (
    <AsyncContent isLoading={isExerciseLoading} error={!exercise} errorMessage={t('exerciseNotFound')}>
      <article className={styles.exerciseContainer}>
        <header>
          <h1>{exercise?.name}</h1>
        </header>

        {isStarted && exercise?.content.instructions && (
          <section className={styles.instructionsSection}>
            <p className={styles.instructions}>{getLocalizedText(i18n.language, exercise.content.instructions)}</p>
          </section>
        )}

        {isStarted && exercise && <section className={styles.exerciseSection}>{renderExercise()}</section>}

        {isStarted && !isCompleted && (
          <Button kind="primary" size="md" onClick={handleSubmit} disabled={!response || isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        )}

        {!isStarted && (
          <Button kind="primary" size="md" onClick={handleStartExercise} disabled={isStarted}>
            {hasFailedAttempt ? t('retryExercise') : t('startExercise')}
          </Button>
        )}

        <section className={styles.feedbackSection}>
          {hint && hasFailedAttempt && (
            <InlineNotification kind="info" title={t('hint')} subtitle={hint} lowContrast hideCloseButton />
          )}

          {hasFailedAttempt && feedback && (
            <>
              {feedback.message && (
                <InlineNotification
                  kind="error"
                  title={t('feedback')}
                  subtitle={feedback.message}
                  lowContrast
                  hideCloseButton
                />
              )}
              {feedback.error && (
                <InlineNotification
                  kind="error"
                  title={t('feedback')}
                  subtitle={feedback.error}
                  lowContrast
                  hideCloseButton
                  className={styles.errorWithWhitespace}
                />
              )}
            </>
          )}

          {isCompleted && (
            <InlineNotification
              kind="success"
              title={t('correctAnswer')}
              subtitle={feedback?.message}
              lowContrast
              hideCloseButton
            />
          )}
        </section>
      </article>
    </AsyncContent>
  );
};

export default ExerciseViewer;
