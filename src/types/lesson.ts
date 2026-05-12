import { type User } from './common';
import { type LocalizedText } from './localization';

export interface Lesson {
  uuid: string;
  name: string;
  description?: string;
  content?: ContentBlock[];
  estimatedMinutes?: number;
  dateCreated?: string;
  retired?: boolean;
  creator?: User;
}

export interface ContentBlock {
  type: ContentBlockType;
  properties?: any;
  content?: LocalizedText;
  items?: LocalizedText[];
}

export enum ContentBlockType {
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  LIST = 'list',
  ALERT = 'alert',
  IMAGE = 'image',
  VIDEO = 'video',
  TABLE = 'table',
}

export enum AlertKind {
  ERROR = 'error',
  INFO = 'info',
  INFO_SQUARE = 'info-square',
  SUCCESS = 'success',
  WARNING = 'warning',
  WARNING_ALT = 'warning-alt',
}

export enum HeadingLevel {
  H1 = 1,
  H2 = 2,
  H3 = 3,
  H4 = 4,
  H5 = 5,
  H6 = 6,
}

export interface HeadingProperties {
  level: HeadingLevel;
}

export interface ListProperties {
  ordered: boolean;
}

export interface AlertProperties {
  variant: AlertKind;
  title?: LocalizedText;
}

export interface MediaProperties {
  url: string;
  alt?: LocalizedText;
  caption?: LocalizedText;
}

export interface TableProperties {
  headers: LocalizedText[];
  rows: LocalizedText[][];
  caption?: LocalizedText;
}
