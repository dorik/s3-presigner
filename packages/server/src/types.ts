import { S3ClientConfig } from "@aws-sdk/client-s3";

export type createS3PresignedUrlInput = {
  bucket: string;
  acl?: string;
  prefix?: string;
  expiresIn?: number;
  configuration?: S3ClientConfig;
};
