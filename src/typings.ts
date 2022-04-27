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
      order?: Order;
      showLoader: boolean;
      url: string;
    }
  | {
      open: false;
      order?: Order;
      showLoader: boolean;
      url?: string;
    };

type Terminal = {
  directory: string;
  message?: string;
  name: string;
  order?: Order;
  show: boolean;
};

type Order = { rows: number[]; cols: number[] };

type File = { path: string; order?: Order };

export type Test = {
  functionName: string;
  arguments?: unknown[];
};

export interface Config {
  bashrc?: Bashrc;
  path: string;
  prepare: string;
  scripts: {
    "develop-course": string;
    "run-course": string;
    test?: Test;
  };
  workspace?: {
    files?: File[];
    previews?: Preview[];
    terminals?: Terminal[];
  };
}
