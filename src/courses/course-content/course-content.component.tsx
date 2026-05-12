import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { accessModule, useEnrollment } from '../../resources/enrollment.resource';
import ExerciseViewer from './exercises/exercise-viewer.component';
import LessonViewer from './lessons/lesson-viewer.component';
import CourseNavigation from './course-navigation.component';
import { ModuleType } from '../../types';
import { useCourseStructure } from '../../resources/course.resource';
import { AsyncContent } from '../../components';
import styles from './course-content.scss';
import { navigate } from '@openmrs/esm-framework';

const CourseContent: React.FC = () => {
  const { courseUuid, contentUuid, contentType } = useParams<{
    courseUuid: string;
    contentUuid: string;
    contentType: string;
  }>();
  const { courseStructure, isLoading: isCourseStructureLoading } = useCourseStructure(courseUuid);
  const { enrollment, mutate: mutateEnrollment, isLoading: isEnrollmentLoading } = useEnrollment(courseUuid);

  const currentModule = useMemo(() => {
    if (!courseStructure?.modules) return null;

    return courseStructure.modules.find((module) => {
      if (contentType.toUpperCase() === ModuleType.LESSON) {
        return module.lesson?.uuid === contentUuid;
      }
      return module.exercise?.uuid === contentUuid;
    });
  }, [courseStructure?.modules, contentUuid, contentType]);

  useEffect(() => {
    if (!enrollment?.uuid || !currentModule?.uuid) return;

    accessModule(enrollment.uuid, currentModule.uuid);
  }, [enrollment?.uuid, currentModule?.uuid]);

  const isLoading = isCourseStructureLoading || isEnrollmentLoading;

  useEffect(() => {
    if (!isLoading && !enrollment) {
      navigate({ to: `${window.spaBase}/training/courses/${courseUuid}` });
    }
  }, [isLoading, enrollment, courseUuid]);

  if (!isLoading && !enrollment) {
    return null;
  }

  return (
    <AsyncContent isLoading={isLoading}>
      <article className={styles.contentContainer}>
        <section className={styles.viewerSection}>
          {contentType.toUpperCase() === ModuleType.LESSON ? (
            <LessonViewer lessonUuid={contentUuid} />
          ) : (
            <ExerciseViewer exerciseUuid={contentUuid} enrollment={enrollment} mutateEnrollment={mutateEnrollment} />
          )}
        </section>

        <CourseNavigation
          courseUuid={courseUuid}
          contentUuid={contentUuid}
          contentType={contentType}
          courseStructure={courseStructure}
          enrollment={enrollment}
        />
      </article>
    </AsyncContent>
  );
};

export default CourseContent;
