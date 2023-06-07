import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const AWS_REGION = "us-east-2";

const s3Client = new S3Client({ region: AWS_REGION });

export const getUploadUrl = async ({ key, bucket, contentType, expiresIn }) => {
  const defaultParams = {
    ACL: "public-read",
  };
  const bucketParams = Object.assign({}, defaultParams, {
    Key: key,
    Bucket: bucket,
    ContentType: contentType,
  });

  const command = new PutObjectCommand(bucketParams);

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: expiresIn || 300,
  });

  return signedUrl;
};
