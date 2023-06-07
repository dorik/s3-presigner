import express, { Request, Response } from "express";
import { createS3PresignedUrl } from "@s3-presigner/server";

const app = express();

const bucketName = process.env.BUCKET_NAME as string;

app.post(
  "/presigned-url",
  express.text(),
  async (req: Request, res: Response) => {
    const { getUploadUrl } = createS3PresignedUrl({
      bucket: bucketName,
    });
    const data = await getUploadUrl(req.body);

    res.send(data);
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express!");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
