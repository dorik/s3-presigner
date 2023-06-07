import express, { Request, Response } from "express";
import { createS3PresignedUrl } from "@s3-presigner/server";

const app = express();

app.post(
  "/presigned-url",
  express.text(),
  async (req: Request, res: Response) => {
    const { getUploadUrl } = createS3PresignedUrl({
      bucket: "cms-api",
    });
    const data = await getUploadUrl(req.body);

    res.send(data);
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
