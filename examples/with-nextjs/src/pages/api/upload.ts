import { NextApiRequest, NextApiResponse } from "next";
import { createS3PresignedUrl } from "@s3-presigner/server";
import { object, array, string, number, validate } from "superstruct";

const bucketName = process.env.BUCKET_NAME as string;

export default async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  const [err, input] = validate(
    body,
    array(
      object({
        name: string(),
        size: number(),
        type: string(),
      })
    )
  );
  if (err) {
    return res.status(422).json({ errors: { message: err?.message } });
  }

  const { getUploadUrl } = createS3PresignedUrl({
    bucket: bucketName,
    acl: "public-read",
  });
  const data = await getUploadUrl(input);

  return res.status(200).json({ data });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100kb",
    },
  },
};
