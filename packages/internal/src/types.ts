export interface HotUpdaterReadStrategy {
  getListObjects(prefix?: string): Promise<string[]>;
}

export interface CliArgs {
  platform: "ios" | "android";
  cwd: string;
}
export interface PluginArgs extends CliArgs {
  cwd: string;
  server: string;
  secretKey: string;
  targetVersion?: string;
}

export interface UpdateSource {
  platform: "ios" | "android";
  targetVersion: string;
  bundleVersion: number;
  forceUpdate: boolean;
  enabled: boolean;
  files: string[];
}

export type UpdateSourceArg =
  | string
  | UpdateSource[]
  | (() => Promise<UpdateSource[]>)
  | (() => UpdateSource[]);

export interface DeployPlugin {
  uploadBundle: () => Promise<void>;
  uploadUpdateJson: (source: UpdateSource) => Promise<void>;
  readStrategy: HotUpdaterReadStrategy;
}
