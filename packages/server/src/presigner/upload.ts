import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import mime from "mime-types";

import { getS3PublicUrl, createUniqueFileKey } from "../utils/helpers";
import { Infer, assert } from "superstruct";
import { FilesInfoSchema } from "./validation";

type TgetPresignedUrl = {
  name: string;
  size: number;
  client: S3Client;
  prefix: string;
  region: string;
  params: Omit<PutObjectCommandInput, "Key" | "Bucket"> & {
    Bucket: string;
  };
  expiresIn: number;
};

type TFilesInfo = Infer<typeof FilesInfoSchema>;

type TgetPresignedUrlOutput = {
  src: string;
  key: string;
  name: string;
  fileType: string;
  signedUrl: string;
};

const getPresignedUrl = async ({
  name,
  size,
  client,
  prefix,
  region,
  params,
  expiresIn,
}: TgetPresignedUrl): Promise<TgetPresignedUrlOutput> => {
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
  async (filesInfo: TFilesInfo): Promise<TgetPresignedUrlOutput[]> => {
    // validate filesInfo
    assert(filesInfo, FilesInfoSchema);

    const presignedPromises = filesInfo.map((f) =>
      getPresignedUrl({ ...f, ...opts })
    );
    return await Promise.all(presignedPromises);
  };
