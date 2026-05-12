import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
  SelectItem,
  Search,
  ProgressBar,
  InlineLoading,
} from '@carbon/react';
import { useCourseAnalytics, useUserAnalytics } from '../resources/analytics.resource';
import { useCourses } from '../resources/course.resource';
import { useDebounce } from '@openmrs/esm-framework';
import { DataTableWrapper, StatisticTile, AsyncContent } from '../components';
import styles from './analytics-dashboard.scss';

const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCourseUuid, setSelectedCourseUuid] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const debouncedUsername = useDebounce(username, 500);

  const { courses, isLoading: isCoursesLoading } = useCourses('', false, false);
  const { courseAnalytics, isLoading: isCourseAnalyticsLoading } = useCourseAnalytics(
    selectedCourseUuid || courses?.[0]?.uuid,
  );
  const {
    error: userAnalyticsError,
    userAnalytics,
    isLoading: isUserAnalyticsLoading,
  } = useUserAnalytics(debouncedUsername);

  const exerciseStatisticsHeaders = useMemo(
    () => [
      { key: 'exerciseName', header: t('exerciseName') },
      { key: 'exerciseType', header: t('exerciseType') },
      { key: 'totalAttempts', header: t('totalAttempts') },
      { key: 'uniqueUsers', header: t('uniqueUsers') },
      { key: 'successRate', header: t('successRate') },
      { key: 'averageAttemptsPerUser', header: t('averageAttemptsPerUser') },
      { key: 'averageTimeSpent', header: t('averageTimeSpent') },
    ],
    [t],
  );

  const exerciseStatisticsRows = useMemo(() => {
    if (!courseAnalytics?.exerciseStatistics) return [];

    return courseAnalytics.exerciseStatistics.map((stat, index) => ({
      id: `${index}`,
      exerciseName: stat.exerciseName,
      exerciseType: stat.exerciseType,
      totalAttempts: stat.totalAttempts,
      uniqueUsers: stat.uniqueUsers,
      successRate: `${stat.successRate.toFixed(2)}%`,
      averageAttemptsPerUser: stat.averageAttemptsPerUser.toFixed(2),
      averageTimeSpent: `${stat.averageTimeSpentMinutes.toFixed(2)} min`,
    }));
  }, [courseAnalytics?.exerciseStatistics]);

  const userCourseDetailsHeaders = useMemo(
    () => [
      { key: 'courseName', header: t('courseName') },
      { key: 'progress', header: t('progress') },
      { key: 'enrolledAt', header: t('enrolledDate') },
      { key: 'lastAccessedAt', header: t('lastAccessed') },
      { key: 'completedAt', header: t('completedDate') },
    ],
    [t],
  );

  const userCourseDetailsRows = useMemo(() => {
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
    <AsyncContent isLoading={isCoursesLoading}>
      <article className={styles.analyticsContainer}>
        <header>
          <h1>{t('analytics')}</h1>
        </header>

        <Tabs>
          <TabList aria-label={t('analyticsTabList')}>
            <Tab>{t('courseAnalytics')}</Tab>
            <Tab>{t('userAnalytics')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <section className={styles.courseAnalyticsPanel}>
                <div className={styles.courseSelector}>
                  <Select
                    id="course-select"
                    labelText={t('selectCourse')}
                    value={selectedCourseUuid || courses?.[0]?.uuid || ''}
                    onChange={(e) => setSelectedCourseUuid(e.target.value)}
                  >
                    {courses?.map((course) => <SelectItem key={course.uuid} value={course.uuid} text={course.name} />)}
                  </Select>
                </div>

                {isCourseAnalyticsLoading ? (
                  <InlineLoading description={t('loading')} />
                ) : courseAnalytics ? (
                  <>
                    <div className={styles.statisticsGrid}>
                      <StatisticTile label={t('totalEnrollments')} value={courseAnalytics.totalEnrollments} />
                      <StatisticTile label={t('activeEnrollments')} value={courseAnalytics.activeEnrollments} />
                      <StatisticTile label={t('completedEnrollments')} value={courseAnalytics.completedEnrollments} />
                      <StatisticTile
                        label={t('averageProgress')}
                        value={courseAnalytics.averageProgress}
                        formatValue={(val) => `${val.toFixed(2)}%`}
                      />
                      <StatisticTile
                        label={t('completionRate')}
                        value={courseAnalytics.completionRate}
                        formatValue={(val) => `${val.toFixed(2)}%`}
                      />
                    </div>

                    <section className={styles.exerciseStatistics}>
                      <h2>{t('exerciseStatistics')}</h2>
                      <AsyncContent isEmpty={exerciseStatisticsRows.length === 0} emptyMessage={t('noExerciseData')}>
                        <DataTableWrapper rows={exerciseStatisticsRows} headers={exerciseStatisticsHeaders} />
                      </AsyncContent>
                    </section>

                    <section className={styles.feedbackSummary}>
                      <h2>{t('feedbackSummary')}</h2>
                      {courseAnalytics.feedbackSummary && courseAnalytics.feedbackSummary.totalResponses > 0 ? (
                        <>
                          <div className={styles.statisticsGrid}>
                            <StatisticTile
                              label={t('totalResponses')}
                              value={courseAnalytics.feedbackSummary.totalResponses}
                            />
                            <StatisticTile
                              label={t('averageClarityRating')}
                              value={courseAnalytics.feedbackSummary.averageClarityRating}
                              formatValue={(val) => val.toFixed(2)}
                            />
                            <StatisticTile
                              label={t('averageDifficultyRating')}
                              value={courseAnalytics.feedbackSummary.averageDifficultyRating}
                              formatValue={(val) => val.toFixed(2)}
                            />
                            <StatisticTile
                              label={t('averageUsefulnessRating')}
                              value={courseAnalytics.feedbackSummary.averageUsefulnessRating}
                              formatValue={(val) => val.toFixed(2)}
                            />
                            <StatisticTile
                              label={t('averageOverallRating')}
                              value={courseAnalytics.feedbackSummary.averageOverallRating}
                              formatValue={(val) => val.toFixed(2)}
                            />
                          </div>

                          {courseAnalytics.feedbackSummary.comments &&
                            courseAnalytics.feedbackSummary.comments.length > 0 && (
                              <aside className={styles.commentsSection}>
                                <h3>{t('comments')}</h3>
                                <ul>
                                  {courseAnalytics.feedbackSummary.comments.map((comment, index) => (
                                    <li key={index}>{comment}</li>
                                  ))}
                                </ul>
                              </aside>
                            )}
                        </>
                      ) : (
                        <p>{t('noFeedbackData')}</p>
                      )}
                    </section>
                  </>
                ) : (
                  <p>{t('selectCourseToViewAnalytics')}</p>
                )}
              </section>
            </TabPanel>

            <TabPanel>
              <section className={styles.userAnalyticsPanel}>
                <div className={styles.userSearch}>
                  <Search
                    id="user-search"
                    labelText={t('searchUser')}
                    placeholder={t('enterUsername')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {isUserAnalyticsLoading ? (
                  <InlineLoading description={t('loading')} />
                ) : userAnalytics ? (
                  <>
                    {userAnalytics.user && (
                      <header>
                        <h2>
                          {t('analyticsFor')}: {userAnalytics.user.display}
                        </h2>
                      </header>
                    )}

                    <div className={styles.statisticsGrid}>
                      <StatisticTile
                        label={t('totalCoursesEnrolled')}
                        value={userAnalytics.totalCoursesEnrolled || 0}
                      />
                      <StatisticTile label={t('coursesCompleted')} value={userAnalytics.coursesCompleted || 0} />
                      <StatisticTile label={t('coursesInProgress')} value={userAnalytics.coursesInProgress || 0} />
                      <StatisticTile
                        label={t('overallProgress')}
                        value={userAnalytics.overallProgress}
                        formatValue={(val) => (val ? `${Math.round(val)}%` : '0%')}
                      />
                    </div>

                    <section className={styles.courseDetails}>
                      <h2>{t('courseDetails')}</h2>
                      <AsyncContent isEmpty={userCourseDetailsRows.length === 0} emptyMessage={t('noCoursesEnrolled')}>
                        <DataTableWrapper rows={userCourseDetailsRows} headers={userCourseDetailsHeaders} />
                      </AsyncContent>
                    </section>
                  </>
                ) : userAnalyticsError ? (
                  <p>{t('userNotFound')}</p>
                ) : (
                  <p>{t('enterUsernameToViewAnalytics')}</p>
                )}
              </section>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </article>
    </AsyncContent>
  );
};

export default AnalyticsDashboard;
