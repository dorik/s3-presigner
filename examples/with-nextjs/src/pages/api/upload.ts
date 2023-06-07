import { NextApiRequest, NextApiResponse } from "next";
import { createS3PresignedUrl } from "@s3-presigner/server";

const bucketName = process.env.BUCKET_NAME as string;

export default async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { getUploadUrl } = createS3PresignedUrl({
    bucket: bucketName,
  });
  const data = await getUploadUrl(req.body);

  return res.json(data);
}
