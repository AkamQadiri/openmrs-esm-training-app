import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Form, TextArea, InlineNotification, RadioButtonGroup, RadioButton } from '@carbon/react';
import { navigate, showSnackbar, showToast } from '@openmrs/esm-framework';
import { submitCourseFeedback, useCourse } from '../../resources/course.resource';
import { AsyncContent } from '../../components';
import styles from './course-feedback.scss';

interface RatingProps {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  scaleDescription?: string;
}

const RatingInput: React.FC<RatingProps> = ({ label, name, value, onChange, scaleDescription }) => {
  return (
    <div>
      <RadioButtonGroup
        legendText={label}
        name={name}
        valueSelected={value.toString()}
        onChange={(selectedValue: string) => onChange(parseInt(selectedValue, 10))}
        orientation="horizontal"
      >
        <RadioButton id={`${name}-1`} labelText="1" value="1" />
        <RadioButton id={`${name}-2`} labelText="2" value="2" />
        <RadioButton id={`${name}-3`} labelText="3" value="3" />
        <RadioButton id={`${name}-4`} labelText="4" value="4" />
        <RadioButton id={`${name}-5`} labelText="5" value="5" />
      </RadioButtonGroup>
      {scaleDescription && <p className={styles.feedbackScale}>{scaleDescription}</p>}
    </div>
  );
};

const CourseFeedback: React.FC = () => {
  const { t } = useTranslation();
  const { courseUuid } = useParams<{ courseUuid: string }>();
  const { course, isLoading: isCourseLoading } = useCourse(courseUuid);

  const [clarityRating, setClarityRating] = useState<number>(0);
  const [difficultyRating, setDifficultyRating] = useState<number>(0);
  const [usefulnessRating, setUsefulnessRating] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = clarityRating > 0 && difficultyRating > 0 && usefulnessRating > 0 && overallRating > 0;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) {
        setError(t('allRatingsRequired'));
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        await submitCourseFeedback(courseUuid, {
          clarityRating,
          difficultyRating,
          usefulnessRating,
          overallRating,
          comment: comment.trim() || undefined,
        });

        showSnackbar({ title: t('feedbackSubmitted'), kind: 'success', isLowContrast: true });

        navigate({ to: `${window.spaBase}/training/courses` });
      } catch (err) {
        setError(t('failedToSubmitFeedback'));
        showToast({
          title: t('error'),
          description: t('failedToSubmitFeedback'),
          kind: 'error',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [isFormValid, courseUuid, clarityRating, difficultyRating, usefulnessRating, overallRating, comment, t],
  );

  return (
    <AsyncContent isLoading={isCourseLoading}>
      <article className={styles.feedbackContainer}>
        <header className={styles.feedbackHeader}>
          <h1>{t('courseFeedback')}</h1>
          <h2>{course?.name}</h2>
        </header>

        <Form onSubmit={handleSubmit} className={styles.feedbackForm}>
          {error && <InlineNotification kind="error" title={t('error')} subtitle={error} lowContrast />}

          <RatingInput
            label={t('clarityRating')}
            name="clarityRating"
            value={clarityRating}
            onChange={setClarityRating}
            scaleDescription={t('clarityRatingScale')}
          />

          <RatingInput
            label={t('difficultyRating')}
            name="difficultyRating"
            value={difficultyRating}
            onChange={setDifficultyRating}
            scaleDescription={t('difficultyRatingScale')}
          />

          <RatingInput
            label={t('usefulnessRating')}
            name="usefulnessRating"
            value={usefulnessRating}
            onChange={setUsefulnessRating}
            scaleDescription={t('usefulnessRatingScale')}
          />

          <RatingInput
            label={t('overallRating')}
            name="overallRating"
            value={overallRating}
            onChange={setOverallRating}
            scaleDescription={t('overallRatingScale')}
          />

          <TextArea
            id="comment"
            labelText={t('comments')}
            placeholder={t('optionalComments')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          <Button type="submit" kind="primary" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? t('submitting') : t('submitFeedback')}
          </Button>
        </Form>
      </article>
    </AsyncContent>
  );
};

export default CourseFeedback;
