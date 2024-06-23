import fs from "node:fs/promises";
import path from "node:path";
import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { type CliArgs, type DeployPlugin, log } from "@hot-updater/internal";
import mime from "mime";
import { readDir } from "./utils/readDir";

export interface AwsConfig
  extends Pick<S3ClientConfig, "credentials" | "region"> {
  bucketName: string;
}

export const uploadS3 =
  (config: AwsConfig) =>
  ({ cwd, platform }: CliArgs): DeployPlugin => {
    const { bucketName, ...s3Config } = config;
    const client = new S3Client(s3Config);

    const buildDir = path.join(cwd, "build");

    return {
      async readStrategy() {
        return {
          updateJson: "",
          files: [],
        };
      },
      async uploadUpdateJson(source) {
        const { updateJson, files } = await this.readStrategy();
      },
      async uploadBundle() {
        log.info("uploading to s3");

        const files = await readDir(buildDir);
        const result = await Promise.allSettled(
          files.map(async (file, index) => {
            const filePath = path.join(buildDir, file);
            const Body = await fs.readFile(filePath);
            const ContentType = mime.getType(filePath) ?? void 0;

            const Key = ["v1_TEST", platform, file.replace(buildDir, "")].join(
              "/",
            );
            const upload = new Upload({
              client,
              params: {
                ContentType,
                Bucket: bucketName,
                Key,
                Body,
              },
            });
            await upload.done();
            return upload;
          }),
        );

        const rejectedCount = result.filter(
          (r) => r.status === "rejected",
        ).length;
        if (rejectedCount > 0) {
          throw new Error("upload failed");
        }
        log.success("upload success");
      },
    };
  };
