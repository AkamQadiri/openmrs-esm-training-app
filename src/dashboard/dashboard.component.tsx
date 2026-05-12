import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '@carbon/react';
import { useCurrentUserAnalytics } from '../resources/analytics.resource';
import { DataTableWrapper, StatisticTile, AsyncContent } from '../components';
import styles from './dashboard.scss';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { userAnalytics, isLoading } = useCurrentUserAnalytics();

  const courseDetailsHeaders = useMemo(
    () => [
      { key: 'courseName', header: t('courseName') },
      { key: 'progress', header: t('progress') },
      { key: 'enrolledAt', header: t('enrolledDate') },
      { key: 'lastAccessedAt', header: t('lastAccessed') },
      { key: 'completedAt', header: t('completedDate') },
    ],
    [t],
  );

  const courseDetailsRows = useMemo(() => {
    if (!userAnalytics?.courseDetails) return [];

    return userAnalytics.courseDetails.map((detail, index) => ({
      id: `${index}`,
      courseName: detail.courseName,
      progress: (
        <ProgressBar value={detail.progressPercentage} max={100} label={`${detail.progressPercentage}%`} size="small" />
      ),
      enrolledAt: new Date(detail.enrolledAt).toLocaleDateString(),
      lastAccessedAt: detail.lastAccessedAt ? new Date(detail.lastAccessedAt).toLocaleDateString() : '-',
      completedAt: detail.completedAt ? new Date(detail.completedAt).toLocaleDateString() : '-',
    }));
  }, [userAnalytics?.courseDetails]);

  return (
    <AsyncContent isLoading={isLoading}>
      <article className={styles.dashboardContainer}>
        <header>
          <h1>{t('myProgress')}</h1>
        </header>

        <section className={styles.statisticsGrid}>
          <StatisticTile label={t('totalCoursesEnrolled')} value={userAnalytics?.totalCoursesEnrolled || 0} />
          <StatisticTile label={t('coursesCompleted')} value={userAnalytics?.coursesCompleted || 0} />
          <StatisticTile label={t('coursesInProgress')} value={userAnalytics?.coursesInProgress || 0} />
          <StatisticTile
            label={t('overallProgress')}
            value={userAnalytics?.overallProgress}
            formatValue={(val) => (val ? `${Math.round(val)}%` : '0%')}
          />
        </section>

        <section className={styles.courseDetailsSection}>
          <h2>{t('courseDetails')}</h2>
          <AsyncContent isEmpty={courseDetailsRows.length === 0} emptyMessage={t('noCoursesEnrolled')}>
            <DataTableWrapper rows={courseDetailsRows} headers={courseDetailsHeaders} />
          </AsyncContent>
        </section>
      </article>
    </AsyncContent>
  );
};

export default Dashboard;
