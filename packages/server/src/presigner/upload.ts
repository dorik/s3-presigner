import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import mime from "mime-types";

import {
  createUniqueFileKey,
  getS3PublicUrl,
  parseBody,
} from "../utils/helpers";

type PutObjectCommandInputType = Omit<
  PutObjectCommandInput,
  "Bucket" | "Key"
> & {
  Bucket: string;
};

type TgetPresignedUrl = {
  name: string;
  client: S3Client;
  prefix: string;
  region: string;
  params: Omit<PutObjectCommandInput, "Key" | "Bucket"> & {
    Bucket: string;
  };
  expiresIn: number;
};

type TgetPresignedUrlOutput = {
  src: string;
  key: string;
  name: string;
  fileType: string;
  signedUrl: string;
};
const getPresignedUrl = async ({
  name,
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
  const bucketParams = Object.assign({}, params, {
    Key: key,
    ContentType: fileType,
  });
  const command = new PutObjectCommand(bucketParams);

  const signedUrl = await getSignedUrl(client, command, { expiresIn });

  return {
    src,
    key,
    name,
    fileType,
    signedUrl,
  };
};

export const getUploadUrl =
  (opts: Omit<TgetPresignedUrl, "name">) =>
  async (body: string): Promise<TgetPresignedUrlOutput[]> => {
    const names = parseBody(body);
    const presignedPromises = names.map((name) =>
      getPresignedUrl({ name, ...opts })
    );
    return await Promise.all(presignedPromises);
  };
