export enum ReadCategory {
  READING = 'reading',
  FINISHED = 'finished',
  WANTS_READ = 'wantsToRead',
}

export interface GoogleCodeResponse {
  code: string;
  scope?: string;
  authuser?: string;
  prompt?: string;
}
