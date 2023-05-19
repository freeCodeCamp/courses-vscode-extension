/* eslint-disable @typescript-eslint/naming-convention */
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

export type Test = {
  functionName: string;
  arguments?: unknown[];
};

export interface Config {
  bashrc?: Bashrc;
  path: string;
  version: string;
  prepare?: string;
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
  bash?: {
    ".bashrc"?: string;
    "sourcerer.sh"?: string;
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
