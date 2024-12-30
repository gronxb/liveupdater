import { getUpdateInfo } from "@hot-updater/utils";
import { NIL_UUID } from "./const";
import { ensureBundles } from "./ensureBundles";
import { init } from "./init";
import {
  addListener,
  getAppVersion,
  getBundleId,
  reload,
  updateBundle,
} from "./native";
import { hotUpdaterStore } from "./store";

export type * from "./init";
export type * from "./native";

export * from "./store";

addListener("onProgress", ({ progress }) => {
  hotUpdaterStore.setState({ progress });
});

export const HotUpdater = {
  init,
  reload,
  getAppVersion,
  getBundleId,
  addListener,

  ensureBundles,
  updateBundle,
  getUpdateInfo,
  /**
   * In production environment, this value will be replaced with a uuidv7.
   */
  HOT_UPDATER_BUNDLE_ID: NIL_UUID,
};
