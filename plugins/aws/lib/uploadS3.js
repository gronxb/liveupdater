var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import fs from "node:fs/promises";
import path from "node:path";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import mime from "mime";
import { readDir } from "./utils/readDir";
export const uploadS3 = (config) => ({ cwd, platform }) => {
    const { bucketName } = config, s3Config = __rest(config, ["bucketName"]);
    const client = new S3Client(s3Config);
    const buildDir = path.join(cwd, "build");
    return {
        upload() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("uploading to s3");
                const files = yield readDir(buildDir);
                const result = yield Promise.allSettled(files.map((file, index) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const filePath = path.join(buildDir, file);
                    const Body = yield fs.readFile(filePath);
                    const ContentType = (_a = mime.getType(filePath)) !== null && _a !== void 0 ? _a : void 0;
                    const Key = ["v1_TEST", platform, file.replace(buildDir, "")].join("/");
                    const upload = new Upload({
                        client,
                        params: {
                            ContentType,
                            Bucket: bucketName,
                            Key,
                            Body,
                        },
                    });
                    yield upload.done();
                    console.log(`uploaded: ${Key}`);
                    return upload;
                })));
                const rejectedCount = result.filter((r) => r.status === "rejected").length;
                if (rejectedCount > 0) {
                    throw new Error("upload failed");
                }
            });
        },
    };
};
//# sourceMappingURL=uploadS3.js.map