import path from "path";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import mime from "mime-types";
import slugify from "slugify";
import { nanoid } from "nanoid";

const getPresignedUrl = async ({
  name,
  client,
  prefix,
  region,
  params,
  expiresIn,
}) => {
  const nameParts = name.split(".");
  const ext = nameParts.pop();
  const fileKey = slugify(nameParts.join("."));
  const fileType = mime.lookup(name);
  const key = path.join(prefix, `${fileKey}-${nanoid(5)}.${ext}`);
  const src = `https://${params.Bucket}.s3.${region}.amazonaws.com/${key}`;
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

type ParamType = {
  bucket: string;
  acl?: string;
  prefix?: string;
  expiresIn?: number;
  configuration?: S3ClientConfig;
};

export const createS3PresignedUrl = ({
  bucket,
  acl,
  prefix,
  expiresIn,
  configuration,
}: ParamType) => {
  const client = new S3Client(configuration || {});
  const params: Omit<PutObjectCommandInput, "Key"> = {
    Bucket: bucket,
    ACL: acl || "public-read",
  };
  const region = configuration?.region || process.env.AWS_DEFAULT_REGION;
  const opts = {
    client,
    params,
    region,
    prefix: prefix || "",
    expiresIn: expiresIn || 300,
  };

  return {
    getUploadUrl: async (body: string) => {
      const names = JSON.parse(body);
      const presignedPromises = names.map((name) =>
        getPresignedUrl({ name, ...opts })
      );
      return await Promise.all(presignedPromises);
    },
  };
};
