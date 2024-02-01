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

type Preview = {
  open: boolean;
  showLoader: boolean;
  url: string;
  timeout: number;
};

type Terminal = {
  directory: string;
  message: string | null;
  name: string;
  show: boolean;
};

type File = { path: string };

export interface Config {
  autoStart: boolean;
  path: string;
  prepare: string;
  scripts: {
    "develop-course": string;
    "run-course": string;
  };
  workspace: {
    files: File[];
    previews: Preview[];
    terminals: Terminal[];
  };
}
