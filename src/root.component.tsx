import { navigate, useLeftNav, userHasAccess, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AnalyticsDashboard from './analytics/analytics-dashboard.component';
import {
  PRIVILEGE_MANAGE_TRAINING,
  PRIVILEGE_PARTICIPATE_TRAINING,
  PRIVILEGE_VIEW_TRAINING_ANALYTICS,
} from './constants/privileges';
import CourseFeedback from './courses/course-content/course-feedback.component';
import CourseContent from './courses/course-content/course-content.component';
import CourseCatalog from './courses/course-catalog/course-catalog.component';
import CourseOverview from './courses/course-overview/course-overview.component';
import styles from './root.scss';
import BulkStudentCreation from './management/bulk-student-creation.component';
import Dashboard from './dashboard/dashboard.component';

const Root: React.FC = () => {
  const session = useSession();
  const canParticipate = userHasAccess(PRIVILEGE_PARTICIPATE_TRAINING, session?.user);
  const canManage = userHasAccess(PRIVILEGE_MANAGE_TRAINING, session?.user);
  const canViewAnalytics = userHasAccess(PRIVILEGE_VIEW_TRAINING_ANALYTICS, session?.user);

  if (!canParticipate && !canManage && !canViewAnalytics) {
    navigate({ to: `${window.spaBase}/home` });
  }

  let defaultPage = '/dashboard';
  if (!canParticipate && !canManage && canViewAnalytics) {
    defaultPage = '/analytics';
  }

  useLeftNav({
    name: 'training-left-panel-slot',
    basePath: `${window.spaBase}/training`,
  });

  return (
    <BrowserRouter basename={`${window.spaBase}/training`}>
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<Navigate to={defaultPage} replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:courseUuid" element={<CourseOverview />} />
          <Route path="/courses/:courseUuid/:contentType/:contentUuid" element={<CourseContent />} />
          <Route path="/courses/:courseUuid/feedback" element={<CourseFeedback />} />
          {canViewAnalytics && <Route path="/analytics" element={<AnalyticsDashboard />} />}
          {canManage && <Route path="/bulk-create-students" element={<BulkStudentCreation />} />}
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default Root;
