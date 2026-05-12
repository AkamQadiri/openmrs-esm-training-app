export interface StudentRecord {
  username: string;
  givenName: string;
  familyName?: string;
  gender: string;
  password?: string;
}

export interface StudentCreationResult {
  username: string;
  success: boolean;
  uuid?: string;
  error?: string;
  warning?: string;
}

export interface BulkCreationResponse {
  results: StudentCreationResult[];
}
