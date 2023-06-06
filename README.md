# S3 Presigner

## Client Side Integration

_Currently supported with React.js projects_

### Installation

`npm install --save @s3-presigner/client`

```jsx
import { useMutation } from "@tanstack/react-query";
import { useUploadFiles } from "@s3-presigner/client";

const { data, isLoading, onUpload } = useUploadFiles();

const { mutate } = useMutation({
  mutationFn: onUpload((body: string) =>
    fetch("/api/upload", { method: "POST", body }).then((res) => res.json())
  ),
});

const handleChange = (event) => {
  mutate(event.target.files);
};
```

## Server Side Integration

You can implement with any Node.js based backend service

### Installation

`npm install --save @s3-presigner/server`

#### Sample Code

#### With Nextjs

```js
// nextjs api route
// for this example: '/api/upload'
import { NextApiRequest, NextApiResponse } from "next";
import { createS3PresignedUrl } from "@s3-presigner/server";

export default async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { getUploadUrl } = createS3PresignedUrl({
    bucket: "{YOUR_BUCKET_NAME}",
  });
  const data = await getUploadUrl(req.body);

  return res.json(data);
}
```

#### With Express REST API

```js
const express = require("express");
const app = express();
const { createS3PresignedUrl } = require("@s3-presigner/server");

app.post("/api/upload", async (req, res) => {
  const { getUploadUrl } = createS3PresignedUrl({
    bucket: "{YOUR_BUCKET_NAME}",
  });
  const data = await getUploadUrl(req.body);

  return res.json(data);
});

module.exports = app;
```
