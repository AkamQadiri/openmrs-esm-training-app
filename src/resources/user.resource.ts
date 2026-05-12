import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import type { BulkCreationResponse, StudentRecord } from '../types/user';

export async function bulkCreateStudents(students: StudentRecord[], defaultPassword: string, defaultLocation: string) {
  const url = `${restBaseUrl}/training/user/bulk-create-students`;

  const data = await openmrsFetch<BulkCreationResponse>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      students,
      defaultPassword,
      defaultLocation,
    }),
  });

  const error = data?.data['stackTrace'];

  if (error) {
    throw new Error(data?.data['localizedMessage']);
  }

  return data;
}
