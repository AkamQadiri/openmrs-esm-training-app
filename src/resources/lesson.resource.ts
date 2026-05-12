import { restBaseUrl, useOpenmrsSWR } from '@openmrs/esm-framework';
import { Representation, type Lesson } from '../types';

export function useLesson(lessonUuid: string, representation: Representation = Representation.DEFAULT) {
  const params = new URLSearchParams();

  if (representation != Representation.DEFAULT) {
    params.append('v', representation);
  }

  const url = lessonUuid ? `${restBaseUrl}/training/lesson/${lessonUuid}?${params}` : null;

  const { data, ...rest } = useOpenmrsSWR<Lesson>(url);

  return { lesson: data?.data, ...rest };
}
