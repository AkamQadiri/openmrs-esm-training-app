import { restBaseUrl, useOpenmrsSWR } from '@openmrs/esm-framework';
import { Representation, type Exercise } from '../types';

export function useExercise(exerciseUuid: string, representation: Representation = Representation.DEFAULT) {
  const params = new URLSearchParams();

  if (representation != Representation.DEFAULT) {
    params.append('v', representation);
  }

  const url = exerciseUuid ? `${restBaseUrl}/training/exercise/${exerciseUuid}?${params}` : null;

  const { data, ...rest } = useOpenmrsSWR<Exercise>(url);

  return { exercise: data?.data, ...rest };
}
