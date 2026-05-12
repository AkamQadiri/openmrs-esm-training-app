import { restBaseUrl, useOpenmrsSWR } from '@openmrs/esm-framework';
import { type CourseAnalytics, type UserAnalytics } from '../types';

export function useCourseAnalytics(courseUuid: string) {
  const url = courseUuid ? `${restBaseUrl}/training/analytics/course/${courseUuid}` : null;

  const { data, ...rest } = useOpenmrsSWR<CourseAnalytics>(url);

  return { courseAnalytics: data?.data, ...rest };
}

export function useCurrentUserAnalytics() {
  const url = `${restBaseUrl}/training/analytics/user`;

  const { data, ...rest } = useOpenmrsSWR<UserAnalytics>(url);

  return { userAnalytics: data?.data, ...rest };
}

export function useUserAnalytics(username: string) {
  const url = username ? `${restBaseUrl}/training/analytics/user/${username}` : null;

  const { data, error, ...rest } = useOpenmrsSWR<UserAnalytics>(url);

  const userNotFound = error || data?.data['stackTrace'];

  return {
    userAnalytics: !userNotFound ? data?.data : undefined,
    error: userNotFound ? data.data : undefined,
    ...rest,
  };
}
