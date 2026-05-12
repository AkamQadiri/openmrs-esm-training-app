import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLesson } from '../../../resources/lesson.resource';
import LessonContent from './lesson-content.component';
import { Representation } from '../../../types';
import { DurationDisplay, AsyncContent } from '../../../components';
import styles from './lesson-viewer.scss';

interface LessonViewerProps {
  lessonUuid: string;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lessonUuid }) => {
  const { t } = useTranslation();
  const { lesson, isLoading } = useLesson(lessonUuid, Representation.FULL);

  return (
    <AsyncContent isLoading={isLoading} error={!lesson} errorMessage={t('lessonNotFound')}>
      <article className={styles.lessonContainer}>
        {lesson?.estimatedMinutes && (
          <header className={styles.lessonHeader}>
            <DurationDisplay minutes={lesson.estimatedMinutes} showLabel />
          </header>
        )}

        <LessonContent lesson={lesson} />
      </article>
    </AsyncContent>
  );
};

export default LessonViewer;
