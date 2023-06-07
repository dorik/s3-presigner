# S3 Presigner

## 👋 Introduction
Welcome to the documentation for S3 Presigner, a powerful ⚡️ and user-friendly 🐈 library that simplifies the process of uploading files to Amazon S3. Whether you're a seasoned developer or new to working with S3, this library aims to streamline your file uploading workflow and provide an intuitive API for integrating S3 file uploads into your applications.

## 🤨 Why

Maybe because you are looking for it 😎

You might be wondering why would you need S3 Presigner library to upload files to Amazon S3. You could directly upload the file to your backend application, process with `multer` or `sharp` then save it to Amazon S3 bucket or even to file system! 👉 [This is a must read for you](./docs/presigned-url.md)

## 🎉 Features

- **Simplified File Upload**: With S3 Presigner, you can effortlessly upload files to your Amazon S3 buckets without worrying about the complexities of managing low-level S3 operations. The library handles the authentication, request signing, and multipart upload process, allowing you to focus on building your application.

- **Flexible Configuration**: Customize your S3 upload behavior by configuring options such as bucket name, key prefix, access control permissions, and more. S3 Presigner provides a range of configurable parameters to suit your specific requirements.

- **Minimum Configuration**: Most of the time you may not need to customize the default behavior of the library. So, you will need only a few lines of code to get started.


## 📚 Guide 
To implement the library follow the guide below. Both server and client side implementation is necessary for a smoother experience

### Server Side Application
### 🎯 Installation
To get started with S3 Presigner, follow these simple installation steps:

```shell
npm install --save @s3-presigner/server
```
or 
```shell
yarn add @s3-presigner/server
```

### 💅 Usage

You have to setup an endpoint where the client application will call to get the presigned URL and continue uploading the files.

For simplicity purpose we provide an example with REST API, but it is not necessary to be only a REST API, you can implement the library with GraphQL API as well as any other Node.js based framework

```js
// ES6
import { createS3PresignedUrl } from "@s3-presigner/server";
// or, Common JS
const { createS3PresignedUrl } = require("@s3-presigner/server");

router.post('/presigned-url', async (req, res) => {
  // Here you can check whether the user have permission to call the API endpoint
  const { getUploadUrl } = createS3PresignedUrl({
    bucket: "{YOUR_S3_BUCKET_NAME}"
  });
  // req.body is a JSON stringified payload 
  // provided by the client library -- 👇 --
  const data = await getUploadUrl(req.body);

  return res.json(data);
});
```

**Read the [API Documentation](./packages/server/README.md#api-documentation)**


### Client Side Application

Works only with React for the time being

### 🎯 Installation
```shell
npm install --save @s3-presigner/client
```
or 
```shell
yarn add @s3-presigner/client
```

### 💅 Usage 

It can be used with any data fetching library or even without any. For simplicity purpose we have used `@tanstack/react-query`

```tsx
import * as React from 'react';
import { useMutation } from "@tanstack/react-query";
import { useUploadFiles } from "@s3-presigner/client";

const { data, isLoading, onUpload } = useUploadFiles();

const { mutate } = useMutation({
  mutationFn: onUpload((body: string) =>
    // -------👇------ server api endpoint
    fetch("/presigned-url", { method: "POST", body }).then((res) => res.json())
  ),
});

const handleChange = (event) => {
  mutate(event.target.files);
};

return (
    <input type="file" multiple onChange={handleChange} />
)
```

**Read the [API Documentation](./packages/client/README.md#api-documentation)**


## ✅ Upcoming

Currently, the library can only handle uploading files to S3 bucket but it is also important to download files by presigned URL. That's the next goal along with some important features listed below

- [ ] Proper error handling and validation
- [ ] Allow specific file types
- [ ] Set a limit for each file size
- [ ] Notify server after image successfully uploaded

## 🧑🏻‍💻 Contribution 

Feel free to send a pull request for any improvement to the library. Don't forget to add emojies 🙌