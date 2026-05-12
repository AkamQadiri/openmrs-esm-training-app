import { openmrsFetch, restBaseUrl, useOpenmrsInfinite, useOpenmrsSWR } from '@openmrs/esm-framework';
import { Representation, type Course, type CourseFeedback, type CourseStructure } from '../types';

export function useCourse(courseUuid: string, representation: Representation = Representation.DEFAULT) {
  const params = new URLSearchParams();

  if (representation != Representation.DEFAULT) {
    params.append('v', representation);
  }

  const url = courseUuid ? `${restBaseUrl}/training/course/${courseUuid}?${params}` : null;

  const { data, ...rest } = useOpenmrsSWR<CourseStructure>(url);

  return { course: data?.data, ...rest };
}

export function useCourses(
  query: string,
  includeRetired: boolean,
  publishedOnly: boolean,
  representation: Representation = Representation.DEFAULT,
) {
  const params = new URLSearchParams();

  if (representation != Representation.REF) {
    params.append('v', representation);
  }

  if (query && query.trimEnd().length > 0) params.append('q', query);
  if (includeRetired) params.append('includeAll', 'true');
  if (publishedOnly) params.append('published', 'true');

  const url = `${restBaseUrl}/training/course?${params}`;

  const { data, ...rest } = useOpenmrsInfinite<Course>(url);

  return { courses: data || [], ...rest };
}

export function useCourseStructure(courseUuid: string) {
  const url = courseUuid ? `${restBaseUrl}/training/course/${courseUuid}/structure` : null;

  const { data, ...rest } = useOpenmrsSWR<CourseStructure>(url);

  return { courseStructure: data?.data, ...rest };
}

export async function submitCourseFeedback(courseUuid: string, feedback: CourseFeedback) {
  const url = courseUuid ? `${restBaseUrl}/training/course/${courseUuid}/feedback` : null;

  return openmrsFetch<CourseFeedback>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  });
}
