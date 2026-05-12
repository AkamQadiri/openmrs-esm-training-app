import { Tile, Button } from '@carbon/react';
import { navigate } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { type CourseEnrollment, type Course } from '../../types';
import { CourseTags, DurationDisplay } from '../../components';
import styles from './course-card.scss';

interface CourseCardProps {
  course: Course;
  enrollment: CourseEnrollment;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, enrollment }) => {
  const { t } = useTranslation();

  const handleViewCourse = () => {
    navigate({ to: `${window.spaBase}/training/courses/${course.uuid}` });
  };

  return (
    <article className={styles.card}>
      <Tile className={styles.tile}>
        <header className={styles.cardHeader}>
          <h2>{course.name}</h2>
          <CourseTags course={course} enrollment={enrollment} />
        </header>

        <section className={styles.cardContent}>
          <p>{course.description}</p>

          {course.estimatedMinutes && <DurationDisplay minutes={course.estimatedMinutes} iconSize={16} />}
        </section>

        <footer className={styles.cardFooter}>
          <Button kind="primary" size="sm" onClick={handleViewCourse}>
            {enrollment
              ? enrollment.progressPercentage === 100
                ? t('reviewCourse')
                : t('continueCourse')
              : t('viewCourse')}
          </Button>
        </footer>
      </Tile>
    </article>
  );
};

export default CourseCard;
