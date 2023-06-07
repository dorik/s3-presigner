import path from "path";
import slugify from "slugify";
import { nanoid } from "nanoid";

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
  const fileKey = slugify(nameParts.join("."));
  const key = path.join(prefix, `${fileKey}-${nanoid(5)}.${ext}`);
  return key;
};

export const parseBody = (body: string): string[] => {
  try {
    return JSON.parse(body);
  } catch (err) {
    throw new Error("Invalid JSON");
  }
};
