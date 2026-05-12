import { Search, Grid, Column } from '@carbon/react';
import { useDebounce, useOnVisible } from '@openmrs/esm-framework';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCourses } from '../../resources/course.resource';
import { useEnrollments } from '../../resources/enrollment.resource';
import CourseCard from './course-card.component';
import { AsyncContent } from '../../components';
import styles from './course-catalog.scss';

const CourseCatalog: React.FC = () => {
  const { t } = useTranslation();
  const [courseFilter, setCourseFilter] = useState('');
  const debouncedCourseFilter = useDebounce(courseFilter, 500);
  const { courses, isLoading: isCoursesLoading, hasMore, loadMore } = useCourses(debouncedCourseFilter, false, true);
  const { enrollments, isLoading: isEnrollmentsLoading } = useEnrollments();

  const isLoading = isCoursesLoading || isEnrollmentsLoading;

  const onScrollToEnd = useCallback(() => {
    if (hasMore) {
      loadMore();
    }
  }, [hasMore, loadMore]);
  const ref = useOnVisible(onScrollToEnd);

  return (
    <article className={styles.catalogContainer}>
      <header>
        <h1>{t('courses')}</h1>
      </header>

      <section className={styles.searchSection}>
        <Search
          size="lg"
          labelText={t('searchCourses')}
          placeholder={t('searchCourses')}
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          onClear={() => setCourseFilter('')}
        />
      </section>

      <AsyncContent isLoading={isLoading} isEmpty={courses.length === 0} emptyMessage={t('noCoursesFound')}>
        <section className={styles.coursesGrid}>
          <Grid>
            {courses.map((course) => (
              <Column key={course.uuid} className={styles.gridColumn} sm={4} md={4} lg={5}>
                <CourseCard course={course} enrollment={enrollments.find((e) => e.course.uuid === course.uuid)} />
              </Column>
            ))}
          </Grid>
          {hasMore && <span ref={ref} />}
        </section>
      </AsyncContent>
    </article>
  );
};

export default CourseCatalog;
