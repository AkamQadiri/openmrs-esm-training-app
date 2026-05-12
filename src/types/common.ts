export interface User {
  uuid: string;
  display: string;
}

export enum Representation {
  REF = 'ref',
  DEFAULT = 'default',
  FULL = 'full',
  CUSTOM = 'custom',
}
