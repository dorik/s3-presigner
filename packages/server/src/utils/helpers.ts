import path from "path";
import slugify from "slugify";
import { nanoid } from "nanoid";

const sanitizeSpecialChar = (fileKey: string) => {
  return fileKey.replace(/[^a-zA-Z0-9]/g, "");
};

type TgetS3PublicUrl = {
  bucket: string;
  region: string;
  key: string;
};
export const getS3PublicUrl = ({ bucket, region, key }: TgetS3PublicUrl) => {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export const createUniqueFileKey = ({
  name,
  prefix,
}: {
  name: string;
  prefix: string;
}) => {
  const nameParts = name.split(".");
  const ext = nameParts.pop();

  const sanitizedFileKey = sanitizeSpecialChar(nameParts.join("."));

  const fileKey = slugify(sanitizedFileKey);

  const key = path.join(prefix, `${fileKey}-${nanoid(5)}.${ext}`);
  return key;
};
