import path from "path";
import {} from "@aws-sdk/client-s3";
import type {
  BasePluginArgs,
  StoragePlugin,
  StoragePluginHooks,
} from "@hot-updater/plugin-core";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import mime from "mime";
import type { Database } from "./types";

export interface SupabaseStorageConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  bucketName: string;
}

export const supabaseStorage =
  (config: SupabaseStorageConfig, hooks?: StoragePluginHooks) =>
  (_: BasePluginArgs): StoragePlugin => {
    const supabase = createClient<Database>(
      config.supabaseUrl,
      config.supabaseAnonKey,
    );

    const bucket = supabase.storage.from(config.bucketName);
    return {
      name: "supabaseStorage",
      async deleteBundle(bundleId) {
        const Key = [bundleId].join("/");

        await bucket.remove([Key]);
        return Key;
      },
      async uploadBundle(bundleId, bundlePath) {
        const Body = await fs.readFile(bundlePath);
        const ContentType = mime.getType(bundlePath) ?? void 0;

        const filename = path.basename(bundlePath);

        const Key = [bundleId, filename].join("/");

        const upload = await bucket.upload(Key, Body, {
          contentType: ContentType,
        });

        const fullPath = upload.data?.fullPath;
        if (!fullPath) {
          throw new Error("Upload Failed");
        }

        hooks?.onStorageUploaded?.();
        return {
          fileUrl: hooks?.transformFileUrl?.(fullPath) ?? fullPath,
        };
      },
    };
  };