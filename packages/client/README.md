# @s3-presigner/client

## Installation

`npm install --save @s3-presigner/client`

## Usage

Currently the package will work only with React projects. It can be used with any data fetching library or even without any

## API Documentation

## `useUploadFiles`

*** `useUploadFiles` is a React hook that lets you handle file uploading ***

It receives no parameter and returns an object of the following properties:

- `data`: A list of information about your files after they have been successfully uploaded or failed. Each item of the list contains [these properties](#data)
- `isLoading`: It is a boolean value that tells you when the file is being uploaded
- `onUpload`: This method handles most of the heavy job. It receives a callback that fetches presigned url from your server ([see server implementation guide](../server/README.md#s3-presignerserver)). The callback must return the value it receives from the server, and the signature of return value must match the response value of `getUploadUrl` on the server

## `data`

`data` is an array of object that contains the following properties:

- `src`: URL of uploaded file. (It should be available if file is successfully uploaded)
- `message`: A message of file upload status
- `success`: A boolean value of file upload status. It is `true` if successfully uploaded, it is `false` if failed to upload the file
- `key`: S3 key for the file
- `name`: Name of the file
- `fileType`: Mime type of the file
- `signedUrl`: Presigned url where the client have uploaded file

*** Argh! It's too much, let's see the code example: ***

## Sample Code

```tsx
import * as React from 'react';
import { useMutation } from "@tanstack/react-query";
import { useUploadFiles } from "@s3-presigner/client";

const { data, isLoading, onUpload } = useUploadFiles();

const { mutate } = useMutation({
  mutationFn: onUpload((body: string) =>
    // -------👇------ Next.js api route
    fetch("/api/upload", { method: "POST", body }).then((res) => res.json())
  ),
});

const handleChange = (event) => {
  mutate(event.target.files);
};

return (
    <input type="file" multiple onChange={handleChange} />
)
```
