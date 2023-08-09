import { S3ClientConfig } from "@aws-sdk/client-s3";

export type createS3PresignedUrlInput = {
  bucket: string;
  acl?: "private" | "public-read";
  prefix?: string;
  expiresIn?: number;
  configuration?: S3ClientConfig;
};
