# @s3-presigner/server

## Installation

`npm install --save @s3-presigner/server`

## Usage

Before you can star using the package with your backend application, you need to create an S3 bucket and setup AWS credentials in your application. There are two ways you can setup your AWS credentials, you can use any of them

1. With env variables: include these env variables to your application

   ```sh
   AWS_ACCESS_KEY_ID={YOUR_AWS_ACCESS_KEY_ID}
   AWS_SECRET_ACCESS_KEY={YOUR_AWS_SECRET_ACCESS_KEY}
   AWS_DEFAULT_REGION={YOUR_AWS_DEFAULT_REGION}
   ```

2. Or, By providing your AWS credentials to `createS3PresignedUrl` method imported from `@s3-presigner/server`

   ```ts
   const { getUploadUrl } = createS3PresignedUrl({
      // ...
      // `configuration` object is optional if you have global env setup for aws credentials
      configuration: {
        region: "{YOUR_S3_BUCKET_REGION}",
        credentials: {
          accessKeyId: "{YOUR_AWS_ACCESS_KEY_ID}",
          secretAccessKey: "{YOUR_AWS_SECRET_ACCESS_KEY}",
        },
      },
    });
   ```

Whether your backend applicaiton is written in REST or GraphQL API, you can use the library to handle file uploads to your S3 bucket

You may use this library only to generate S3 presigned URL to upload files on your own but we recommend using it with the complimentary client library `@s3-presigned/client`. It will make your file uploading process effortless

## API Documentation

## `createS3PresignedUrl`

`createS3PresignedUrl` is a method that creates S3 client with your provided configurations. It returns an object containing `getUploadUrl` method

### Parameters

`createS3PresignedUrl` receives an object of some required and optional properties

- `bucket`: (`required`) Your S3 bucket name
- `prefix`: (`optional`) If you do not want to place all the uploaded files into the root folder(!) of your S3 bucket then provide a `string` value to the property. You also can organize files in your S3 bucket by providing a dynamic string value to the property. Default to root
- `acl`: (`optional`) Decide who will be allowed to access your S3 files uploaded to the bucket. Default to `undefined` which makes objects private, [list of accepted values](https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#:~:text=%3C/AccessControlPolicy%3E-,Canned%20ACL,-Amazon%20S3%20supports)
- `expiresIn`: (`optional`) How long the presigned URL will be valid for. Accepts `number` value in seconds. Default to `300`
- `configuration`: (`optional`) If you already have your AWS credentials setup with default env variables and do not want to upload files to the same AWS account or region, you can use this property to configure the S3 client with different AWS credentials and region.

### Returns

`createS3PresignedUrl` returns an object that contain `getUploadUrl` method

## getUploadUrl

`getUploadUrl` is an async method that receives a string and returns a list of presigned URL along with some necessary properties

### Parameters

`getUploadUrl` receives a single patameter, provided by the client with the request object or query arguement. `@s3-presigner/server` does not interfare with server implementation. It does not care how you handle your server api requests. It only asks for an array of file information coming from the client prepared by `@s3-presigner/client`

### Returns

It returns an array of object that contains information about files that will be uploading to S3 bucket

- `src`: URL of uploaded file. (Not available immediately after the request. You need to wait for the completion of file upload)
- `key`: S3 key for the file
- `name`: Name of the file
- `fileType`: Mime type of the file
- `signedUrl`: Presigned url where the client will upload file