/* eslint-disable @typescript-eslint/naming-convention */
export enum FlashTypes {
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}

export type Flash = {
  message: string;
  opts?: {
    detail: string;
    modal?: boolean;
  };
  type: FlashTypes;
};

export interface Course {
  githubLink: string;
  name: string;
  tags: string[];
}

export interface Courses {
  courses: Course[];
}

export type Bashrc =
  | { enabled: true; path: string }
  | { enabled: false; path?: string };

type Preview =
  | {
      open: true;
      timeout: number;
      url: string;
    }
  | {
      open: false;
      timeout?: number;
      url?: string;
    };

type Terminal = {
  directory: string;
  message?: string;
  name: string;
  show: boolean;
};

type File = { name: string };

export interface Config {
  bashrc?: Bashrc;
  path: string;
  scripts: {
    "develop-course": string;
    "run-course": string;
    test?: string;
  };
  workspace?: {
    files?: File[];
    previews?: Preview[];
    terminals?: Terminal[];
    order?: string[];
  };
}
