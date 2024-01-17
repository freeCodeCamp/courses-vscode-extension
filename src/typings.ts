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
      showLoader: boolean;
      url: string;
      timeout: number;
    }
  | {
      open: false;
      showLoader: boolean;
      url?: string;
      timeout?: number;
    };

type Terminal = {
  directory: string;
  message?: string;
  name: string;
  show: boolean;
};

type File = { path: string };

export interface Config {
  bashrc?: Bashrc;
  path?: string;
  version: string;
  prepare?: string;
  scripts: {
    "develop-course": string;
    "run-course": string;
  };
  workspace?: {
    autoStart?: boolean;
    files?: File[];
    previews?: Preview[];
    terminals?: Terminal[];
  };
  client?: {
    assets?: {
      header?: string;
      favicon?: string;
    };
    landing?: {
      description?: string;
      "faq-link"?: string;
      "faq-text"?: string;
    };
  };
  config?: {
    "projects.json"?: string;
    "state.json"?: string;
  };
  curriculum: {
    locales: {
      [key: string]: string;
    };
  };
  hotReload?: {
    ignore?: string[];
  };
  tooling?: {
    helpers?: string;
  };
}
