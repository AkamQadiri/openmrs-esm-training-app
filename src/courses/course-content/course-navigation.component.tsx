import { Button, ButtonSet } from '@carbon/react';
import { ArrowLeft, ArrowRight, List } from '@carbon/react/icons';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type CourseEnrollment, ModuleType, type CourseModule, type CourseStructure } from '../../types';
import { completeModule } from '../../resources/enrollment.resource';
import styles from './course-navigation.scss';
import { navigate } from '@openmrs/esm-framework';

interface CourseNavigationProps {
  courseUuid: string;
  contentUuid: string;
  contentType: string;
  courseStructure: CourseStructure;
  enrollment: CourseEnrollment;
}

const CourseNavigation: React.FC<CourseNavigationProps> = ({
  courseUuid,
  contentUuid,
  contentType,
  courseStructure,
  enrollment,
}) => {
  const { t } = useTranslation();

  const currentModuleIndex = useMemo(() => {
    if (!courseStructure?.modules) return -1;

    return courseStructure.modules.findIndex((module) => {
      if (contentType.toUpperCase() === ModuleType.LESSON) {
        return module.lesson?.uuid === contentUuid;
      }

      return module.exercise?.uuid === contentUuid;
    });
  }, [courseStructure?.modules, contentUuid, contentType]);

  const currentModule = useMemo(() => {
    if (!courseStructure?.modules || currentModuleIndex === -1) return null;
    return courseStructure.modules[currentModuleIndex];
  }, [courseStructure?.modules, currentModuleIndex]);

  const previousModule = useMemo(() => {
    if (!courseStructure?.modules || currentModuleIndex <= 0) return null;
    return courseStructure.modules[currentModuleIndex - 1];
  }, [courseStructure?.modules, currentModuleIndex]);

  const nextModule = useMemo(() => {
    if (!courseStructure?.modules || currentModuleIndex === -1) return null;
    if (currentModuleIndex >= courseStructure.modules.length - 1) return null;
    return courseStructure.modules[currentModuleIndex + 1];
  }, [courseStructure?.modules, currentModuleIndex]);

  const isLastModule = useMemo(() => {
    return currentModuleIndex === courseStructure?.modules?.length - 1;
  }, [currentModuleIndex, courseStructure?.modules]);

  const isCurrentModuleCompleted = useMemo(() => {
    if (currentModuleIndex === -1 || !courseStructure?.modules) return false;
    if (!enrollment?.nextModule) return true;

    const enrollmentNextModuleIndex = courseStructure.modules.findIndex(
      (module) => module.uuid === enrollment.nextModule.uuid,
    );
    return enrollmentNextModuleIndex > currentModuleIndex;
  }, [enrollment?.nextModule, currentModuleIndex, courseStructure?.modules]);

  const canAccessNext = useMemo(() => {
    if (!nextModule) return false;
    if (currentModule?.moduleType === ModuleType.LESSON || !currentModule?.required) return true;
    return isCurrentModuleCompleted;
  }, [nextModule, currentModule, isCurrentModuleCompleted]);

  const canComplete = useMemo(() => {
    if (!isLastModule || !enrollment) return false;
    if (currentModule?.moduleType === ModuleType.LESSON || !currentModule?.required) return true;
    return isCurrentModuleCompleted;
  }, [isLastModule, enrollment, currentModule, isCurrentModuleCompleted]);

  const handleNavigation = useCallback(
    (targetModule: CourseModule) => {
      const moduleType = targetModule.moduleType.toLowerCase();
      const moduleUuid =
        targetModule.moduleType === ModuleType.LESSON ? targetModule.lesson?.uuid : targetModule.exercise?.uuid;

      if (moduleUuid) {
        navigate({ to: `${window.spaBase}/training/courses/${courseUuid}/${moduleType}/${moduleUuid}` });
      }
    },
    [courseUuid],
  );

  const handlePrevious = useCallback(() => {
    if (previousModule) {
      handleNavigation(previousModule);
    }
  }, [previousModule, handleNavigation]);

  const handleNext = useCallback(() => {
    if (nextModule && canAccessNext) {
      handleNavigation(nextModule);
    }
  }, [nextModule, canAccessNext, handleNavigation]);

  const handleBackToCourse = useCallback(() => {
    navigate({ to: `${window.spaBase}/training/courses/${courseUuid}` });
  }, [courseUuid]);

  const handleCompleteCourse = useCallback(() => {
    completeModule(enrollment.uuid, currentModule.uuid);
    navigate({ to: `${window.spaBase}/training/courses/${courseUuid}/feedback` });
  }, [enrollment.uuid, currentModule.uuid, courseUuid]);

  return (
    <nav className={styles.navigationContainer}>
      <div className={styles.progressInfo}>
        {currentModule && (
          <span>
            {t('module')} {currentModuleIndex + 1} {t('of')} {courseStructure.modules.length}
          </span>
        )}
      </div>

      <ButtonSet className={styles.navigationButtons}>
        <Button kind="secondary" size="md" onClick={handlePrevious} disabled={!previousModule}>
          {t('previousModule')}
        </Button>

        <Button kind="tertiary" size="md" renderIcon={List} onClick={handleBackToCourse}>
          {t('backToCourse')}
        </Button>

        {isLastModule ? (
          <Button kind="primary" size="md" onClick={handleCompleteCourse} disabled={!canComplete}>
            {t('completeCourse')}
          </Button>
        ) : (
          <Button kind="primary" size="md" renderIcon={ArrowRight} onClick={handleNext} disabled={!canAccessNext}>
            {t('nextModule')}
          </Button>
        )}
      </ButtonSet>
    </nav>
  );
};

export default CourseNavigation;
