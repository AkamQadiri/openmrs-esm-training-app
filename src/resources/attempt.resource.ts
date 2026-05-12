import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type ExerciseAttempt } from '../types';

export async function startExerciseAttempt(enrollmentUuid: string, exerciseUuid: string) {
  const url = `${restBaseUrl}/training/attempt/start`;

  return openmrsFetch<ExerciseAttempt>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enrollmentUuid, exerciseUuid }),
  });
}

export async function submitExerciseAttempt(exerciseUuid: string, enrollmentUuid: string, response: string) {
  const url = exerciseUuid ? `${restBaseUrl}/training/attempt/${exerciseUuid}/submit` : null;

  const data = await openmrsFetch<ExerciseAttempt>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enrollmentUuid, response }),
  });

  const error = data?.data['stackTrace'];

  if (error) {
    throw new Error(data?.data['localizedMessage']);
  }

  return data;
}
