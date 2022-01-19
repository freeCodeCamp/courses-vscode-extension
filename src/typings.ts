/* eslint-disable @typescript-eslint/naming-convention */
export enum FlashTypes {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export type Flash = {
  message: string;
  type: FlashTypes;
};

export interface Course {
  name: string;
  githubLink: string;
  tags: string[];
}

export interface Courses {
  courses: Course[];
}
