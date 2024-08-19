import type { BuildPluginArgs } from "@hot-updater/internal";
import type { InputConfigT } from "metro-config";
export declare const metro: (overrideConfig?: InputConfigT) => ({ cwd, platform }: BuildPluginArgs) => Promise<{
    buildPath: string;
    outputs: string[];
}>;
