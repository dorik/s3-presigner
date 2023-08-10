import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import mime from "mime-types";
import { assert } from "superstruct";

import { FilesInfoSchema } from "./validation";
import { getS3PublicUrl, createUniqueFileKey } from "../utils/helpers";

type TgetPresignedUrl = {
  readonly name: string;
  readonly size: number;
  readonly client: S3Client;
  readonly prefix: string;
  readonly region: string;
  readonly params: Omit<PutObjectCommandInput, "Key" | "Bucket"> & {
    Bucket: string;
  };
  readonly expiresIn: number;
};

type TFileInfo = {
  readonly name: string;
  readonly size: number;
  readonly type: string;
};

type TgetPresignedUrlOutput = {
  readonly src: string;
  readonly key: string;
  readonly name: string;
  readonly fileType: string;
  readonly signedUrl: string;
};

const getPresignedUrl = async (
  props: TgetPresignedUrl
): Promise<TgetPresignedUrlOutput> => {
  const { name, size, client, prefix, region, params, expiresIn } = props;
  const fileType = mime.lookup(name);
  if (!fileType) {
    throw "File type not found";
  }
  const key = createUniqueFileKey({ prefix, name });
  const src = getS3PublicUrl({ bucket: params.Bucket, key, region });
  const bucketParams: PutObjectCommandInput = {
    ...params,
    Key: key,
    ContentLength: size,
    ContentType: fileType,
  };
  const command = new PutObjectCommand(bucketParams);
  const signedUrl = await getSignedUrl(client, command, { expiresIn });

  return { src, key, name, fileType, signedUrl };
};

export const getUploadUrl =
  (opts: Omit<TgetPresignedUrl, "name" | "size">) =>
  async (filesInfo: TFileInfo[]) => {
    // validate filesInfo
    assert(filesInfo, FilesInfoSchema);

    const presignedPromises = filesInfo.map((fInfo) =>
      getPresignedUrl({ ...fInfo, ...opts })
    );

    return await Promise.all(presignedPromises);
  };
