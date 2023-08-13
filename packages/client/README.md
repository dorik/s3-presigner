# @s3-presigner/client

## Installation

`npm install --save @s3-presigner/client`

## Usage

This package is meant to use in combination with `@s3-presigner/server` package in your server side application. Both of the packages are complimentary to each other. The client package handles most of the work related to file uploading but relies on you to provide presigned urls after fetching them from your server. We will discuss more on this in API documentation.

## API Documentation

## `useUploadFiles`

*** `useUploadFiles` is a React hook that handles file uploading ***

The full signature for the hook is given below:
```js
const {
  data, 
  isLoading,
  onSelect,
} = useUploadFiles();
```

#### Returns


`data: TUploadFileResponse[] | undefined`

- data is a list of file information (eg: src, s3 key) after they have been uploaded. Otherwise the value is `undefined`
- Properties of each object in data array: 
  - `file`: (`File`) Original file object that has been uploaded or failed to upload. It is there so that you can retry uploading with new presigned URL
  - `key`: Type `string`. S3 object key. It includes any prefix you have provided with your server config
  - `src`: Type `string`. A full url for the file. You can access the file publicly using the url if you have provided right `ACL` value on your server setup. Otherwise it'll give you an error while trying to load the URL.
  - `name`: Type `string`. The file name that you have had in your computer
  - `fileType`: Type `string`. The file type that you have uploaded
  - `success`: Type `boolean`. It indicates whether the file has been successfully uploaded or not. You can retry uploading the files that have `false` value to this property

`isLoading: boolean`
- Default `false`. It indicates file uploading state. You can show a loading indicator on the UI when the value is `true`, and hide it when `false`

`onSelect: (callback: TGetUploadUrlsFn) => (files: FileList) => Promise<TUploadFileResponse[]>`
-  This method does most of the heavy job. It is responsible for preparing files before it can upload them to S3 with presigned URLs 
- It is a curried function that returns another function after you invoke. The first part of the curry takes a callback (`TGetUploadUrlsFn`) as an argument, and the second part takes files (`FileList`) object that you have selected using html file input
- `callback: TGetUploadUrlsFn`

  - Type `(input: {
        readonly name: string;
        readonly size: number;
        readonly type: string;
      }[]
    ) => Promise<{
      key: string;
      src: string;
      name: string;
      fileType: string;
      signedUrl: string;
    }[]>`
  - The callback accepts one argument that contains an array of information about the files to be uploaded. The signature of the array items: 
  ```ts
    { name: string, type: string, size: number }
  ```
  - Inside the callbaack body you will need to fetch presigned URLs from your server ([see server implementation guide](../server/README.md#s3-presignerserver)), and return a promise. 
  - While fetching the presigned URLs from your server, it is expected that you'll provide the argument values into the request body without any modification
  - If the server could generate the presigned URLs, it'll return a successful response with an array of following signature: 
  ```ts
    { key: string; src: string; name: string; fileType: string; signedUrl: string; }
  ```
  - Your need to select the data from your server response and return it immediately without any modification
  - If the return type is not provided, the callback will throw a validation error. It is strongly suggested not to modify the values and return as it is.
  - If your server respond with any type of validation error, this is the place where you need to handle them