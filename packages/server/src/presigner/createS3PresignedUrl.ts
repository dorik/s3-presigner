import { assert } from "superstruct";
import { S3Client } from "@aws-sdk/client-s3";

import { getUploadUrl } from "../presigner/upload";
import type { createS3PresignedUrlInput } from "../types";
import { createS3PresignedUrlInputValidator } from "./validation";

const defaultRegion = process.env.AWS_DEFAULT_REGION;

export const createS3PresignedUrl = (input: createS3PresignedUrlInput) => {
  // input validation
  assert(input, createS3PresignedUrlInputValidator);

  const { bucket, acl, prefix, expiresIn, configuration } = input;
  const client = new S3Client(configuration || {});
  const params = { Bucket: bucket, ACL: acl || "public-read" };
  const region = (configuration?.region || defaultRegion) as string;
  if (!region) {
    throw "You must specify a region";
  }
  const opts = {
    client,
    params,
    region,
    prefix: prefix || "",
    expiresIn: expiresIn || 300,
  };

  return {
    getUploadUrl: getUploadUrl(opts),
  };
};
