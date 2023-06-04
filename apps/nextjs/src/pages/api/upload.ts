import { NextApiRequest, NextApiResponse } from "next";
import { createS3PresignedUrl } from "@dorik/server";

export default async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { getUploadUrl } = createS3PresignedUrl({ bucket: "cms-api" });
  const data = await getUploadUrl(req.body);

  return res.json(data);
}
