export enum ReadCategory {
  READING = 'reading',
  FINISHED = 'finished',
  WANTS_READ = 'wantsToRead',
}

export enum BookEntryActionType {
  SUMMARY = 'summary',
  QUOTES = 'quotes',
}

export interface GoogleCodeResponse {
  code: string;
  scope?: string;
  authuser?: string;
  prompt?: string;
  redirectUri: string;
}
