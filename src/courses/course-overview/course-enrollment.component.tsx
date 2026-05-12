import { Button, InlineLoading } from '@carbon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Course } from '../../types';
import { enrollInCourse } from '../../resources/enrollment.resource';
import { showSnackbar, showToast } from '@openmrs/esm-framework';

interface CourseEnrollmentProps {
  course: Course;
  onEnroll: () => void;
}

const CourseEnrollment: React.FC<CourseEnrollmentProps> = ({ course, onEnroll }) => {
  const { t } = useTranslation();
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollInCourse(course.uuid);
      onEnroll();
      showSnackbar({ title: t('enrolledSuccessfully'), kind: 'success', isLowContrast: true });
    } catch (error) {
      showToast({
        title: t('error'),
        description: t('failedToEnroll'),
        kind: 'error',
      });
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <>
      {enrolling ? (
        <InlineLoading description={t('enrolling')} />
      ) : (
        <Button kind="primary" onClick={handleEnroll}>
          {t('enrollInCourse')}
        </Button>
      )}
    </>
  );
};

export default CourseEnrollment;
