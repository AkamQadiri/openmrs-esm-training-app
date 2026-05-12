import { openmrsFetch, restBaseUrl, useOpenmrsSWR } from '@openmrs/esm-framework';
import { type CourseEnrollment } from '../types';

export function useEnrollments() {
  const url = `${restBaseUrl}/training/enrollment/`;

  const { data, ...rest } = useOpenmrsSWR<{ enrollments: Array<CourseEnrollment> }>(url);

  return {
    enrollments: data?.data?.enrollments || [],
    ...rest,
  };
}

export function useEnrollment(courseUuid: string) {
  const url = courseUuid ? `${restBaseUrl}/training/enrollment/course/${courseUuid}` : null;

  const { data, error, ...rest } = useOpenmrsSWR<CourseEnrollment>(url);
  const enrollmentNotFound = error || data?.data['stackTrace'];

  return {
    enrollment: !enrollmentNotFound ? data?.data : null,
    error: enrollmentNotFound ? data.data : undefined,
    ...rest,
  };
}

export async function enrollInCourse(courseUuid: string) {
  const url = courseUuid ? `${restBaseUrl}/training/enrollment/course/${courseUuid}` : null;

  return openmrsFetch<CourseEnrollment>(url, {
    method: 'POST',
  });
}

export async function accessModule(enrollmentUuid: string, moduleUuid: string) {
  const url = `${restBaseUrl}/training/enrollment/module/access`;

  return openmrsFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enrollmentUuid, moduleUuid }),
  });
}

export async function completeModule(enrollmentUuid: string, moduleUuid: string) {
  const url = `${restBaseUrl}/training/enrollment/module/complete`;

  return openmrsFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enrollmentUuid, moduleUuid }),
  });
}
