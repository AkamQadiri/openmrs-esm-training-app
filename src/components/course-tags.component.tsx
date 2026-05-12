import { Tag } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { type CourseEnrollment, type Course } from '../types';
import { userHasAccess, useSession } from '@openmrs/esm-framework';
import { PRIVILEGE_MANAGE_TRAINING } from '../constants/privileges';

interface CourseTagsProps {
  course: Course;
  enrollment: CourseEnrollment;
}

const CourseTags: React.FC<CourseTagsProps> = ({ course, enrollment }) => {
  const { t } = useTranslation();
  const session = useSession();
  const hasManagePrivilege = userHasAccess(PRIVILEGE_MANAGE_TRAINING, session?.user);

  return (
    <aside>
      {hasManagePrivilege && (
        <>
          {course.published ? (
            <Tag type="green" size="sm">
              {t('published')}
            </Tag>
          ) : (
            <Tag type="gray" size="sm">
              {t('unpublished')}
            </Tag>
          )}
          <Tag type="high-contrast" size="sm">
            v{course.version}
          </Tag>
        </>
      )}
      {enrollment &&
        (enrollment.completedAt != null ? (
          <Tag type="green" size="sm">
            {t('completed')}
          </Tag>
        ) : (
          <Tag type="blue" size="sm">
            {enrollment.progressPercentage}%
          </Tag>
        ))}
    </aside>
  );
};

export default CourseTags;
