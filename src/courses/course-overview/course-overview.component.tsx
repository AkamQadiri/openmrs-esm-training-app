import { Button, Accordion, AccordionItem } from '@carbon/react';
import { CheckmarkFilled } from '@carbon/react/icons';
import { navigate } from '@openmrs/esm-framework';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useCourseStructure } from '../../resources/course.resource';
import { useEnrollment } from '../../resources/enrollment.resource';
import CourseEnrollment from './course-enrollment.component';
import { CourseTags, DurationDisplay, AsyncContent } from '../../components';
import { ModuleType, type CourseModule } from '../../types';
import styles from './course-overview.scss';

const CourseOverview: React.FC = () => {
  const { t } = useTranslation();
  const { courseUuid } = useParams<{ courseUuid: string }>();
  const { courseStructure, isLoading: isCourseStructureLoading } = useCourseStructure(courseUuid);
  const { enrollment, mutate: mutateEnrollment, isLoading: isEnrollmentLoading } = useEnrollment(courseUuid);

  const isLoading = isCourseStructureLoading || isEnrollmentLoading;

  const nextModuleIndex = useMemo(() => {
    if (!enrollment || !enrollment.nextModule || !courseStructure?.modules) {
      return -1;
    }

    return courseStructure.modules.findIndex((m) => m.uuid === enrollment.nextModule.uuid);
  }, [enrollment, courseStructure?.modules]);

  const handleStartContent = useCallback(
    (module: CourseModule) => {
      const moduleUuid = module.moduleType == ModuleType.LESSON ? module.lesson.uuid : module.exercise.uuid;

      navigate({
        to: `${window.spaBase}/training/courses/${courseUuid}/${module.moduleType.toLowerCase()}/${moduleUuid}`,
      });
    },
    [courseUuid],
  );

  const handleContinueCourse = useCallback(() => {
    if (courseStructure.modules.length === 0) return;

    let continueModule = courseStructure.modules[0];

    if (enrollment && enrollment.lastAccessedModule) {
      continueModule = courseStructure.modules.find((m) => m.uuid == enrollment.lastAccessedModule.uuid);
    }

    handleStartContent(continueModule);
  }, [courseStructure?.modules, enrollment, handleStartContent]);

  return (
    <AsyncContent isLoading={isLoading} error={!courseStructure} errorMessage={t('courseNotFound')}>
      <article className={styles.overviewContainer}>
        <header className={styles.overviewHeader}>
          <CourseTags course={courseStructure} enrollment={enrollment} />
          <h1>{courseStructure?.name}</h1>
          <p>{courseStructure?.description}</p>
          {courseStructure?.estimatedMinutes && (
            <DurationDisplay minutes={courseStructure?.estimatedMinutes} iconSize={20} />
          )}
        </header>

        {enrollment ? (
          <Button kind="primary" onClick={handleContinueCourse} disabled={courseStructure?.modules.length === 0}>
            {enrollment.progressPercentage > 0 ? t('continueCourse') : t('startCourse')}
          </Button>
        ) : (
          <CourseEnrollment course={courseStructure} onEnroll={mutateEnrollment} />
        )}

        <section className={styles.contentSection}>
          <h2>{t('courseContent')}</h2>
          <Accordion className={styles.courseAccordion}>
            {courseStructure?.modules.map((item, index) => {
              const isCompleted = enrollment && (enrollment.completedAt || index < nextModuleIndex);
              const prerequisiteMet =
                enrollment &&
                (enrollment.completedAt ||
                  courseStructure.modules.slice(0, index).every((m, i) => !m.required || i < nextModuleIndex));
              const isLocked = !prerequisiteMet;
              const moduleItem = item.moduleType === ModuleType.LESSON ? item.lesson : item.exercise;

              return (
                <AccordionItem
                  key={item.uuid}
                  title={
                    <span className={styles.moduleTitle}>
                      <span className={styles.moduleNumber}>{index + 1}</span>
                      <span className={styles.moduleType}>
                        {item.moduleType === ModuleType.LESSON ? t('lesson') : t('exercise')}
                      </span>
                      <span className={styles.moduleName}>{moduleItem.name}</span>
                      {isCompleted && <CheckmarkFilled size={20} className={styles.checkmark} />}
                    </span>
                  }
                  disabled={isLocked}
                >
                  <div className={styles.moduleContent}>
                    {item.lesson && <p>{item.lesson.description}</p>}
                    {item.lesson && item.lesson.estimatedMinutes && (
                      <DurationDisplay minutes={item.lesson.estimatedMinutes} iconSize={16} />
                    )}
                    <Button
                      kind="primary"
                      size="sm"
                      disabled={isLocked}
                      onClick={() => !isLocked && handleStartContent(item)}
                    >
                      {isLocked ? t('enrollToAccess') : t('start')}
                    </Button>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      </article>
    </AsyncContent>
  );
};

export default CourseOverview;
