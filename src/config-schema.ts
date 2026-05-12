import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  defaultStudentPassword: {
    _type: Type.String,
    _default: 'Temp123!',
    _description: 'The default password for bulk created students',
  },
  defaultStudentLocation: {
    _type: Type.String,
    _default: 'Site 1',
    _description: 'The default location for bulk created students',
  },
  maxFileUploadSizeMB: {
    _type: Type.Number,
    _description: 'Maximum file size for media uploads in MB',
    _default: 50,
  },
  supportedMediaTypes: {
    _type: Type.Array,
    _description: 'Supported media file types',
    _default: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'],
  },
};

export type Config = {
  defaultStudentPassword: string;
  defaultStudentLocation: string;
  maxFileUploadSizeMB: number;
  supportedMediaTypes: Array<string>;
};
