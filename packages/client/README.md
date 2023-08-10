# @s3-presigner/client

## Installation

`npm install --save @s3-presigner/client`

## Usage

Currently the package will work only with React application. It can be used with any data fetching library or even without any

## API Documentation

## `useUploadFiles`

*** `useUploadFiles` is a React hook that lets you handle file uploading ***

It receives no parameter and returns an object of the following properties:

- `data`: A list of information about your files after they have been successfully uploaded or failed. Each item of the list contains [these properties](#data)
- `isLoading`: It is a boolean value, `true` while the file is being uploaded, `false` when uploading is finished
- `onSelect`: This method does most of the heavy job. It is responsible for preparing files before it can upload them to S3 with presigned URLs. It takes a callback function as the first argument that fetches presigned URLs from your server ([see server implementation guide](../server/README.md#s3-presignerserver)). The callback must return an array of presigned URLs sent from the server. The return type is an array of
  ```ts
    key: string;
    src: string;
    name: string;
    fileType: string;
    signedUrl: string;
  ```
  If the return type is not provided onSelect callback will throw a validation error.

## `data`

`data` is an array of object that contains the following properties:

- `src`: URL of uploaded file. (It should be available if file is successfully uploaded)
- `message`: A message of file upload status
- `success`: A boolean value of file upload status. It is `true` if successfully uploaded, it is `false` if failed to upload the file
- `key`: S3 key for the file
- `name`: Name of the file
- `fileType`: Mime type of the file
