import { array, assert, Describe, object, string } from "superstruct";

import type {
  PresignedType,
  PresignedResponse,
  GetPresignedUrlsType,
} from "../types";

const PresignedUrlsResponseSchema: Describe<PresignedType[]> = array(
  object({
    key: string(),
    src: string(),
    name: string(),
    fileType: string(),
    signedUrl: string(),
  })
);

const s3Upload = async (
  presigned: PresignedType,
  file: File
): Promise<PresignedResponse> => {
  const res = await fetch(presigned.signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (res.ok) {
    return {
      message: "File uploaded successfully",
      success: true,
      ...presigned,
    };
  } else {
    return { message: "Failed to upload file", success: false, ...presigned };
  }
};

export const uploadFiles = async (
  files: File[],
  getPresignedUrls: GetPresignedUrlsType
): Promise<PresignedResponse[]> => {
  files = [...files];
  const filesInfo = files.map(({ name, size, type }) => ({ name, size, type }));
  const data = await getPresignedUrls(filesInfo);
  // validate callback response
  assert(data, PresignedUrlsResponseSchema);

  const promises = data.map((presigned) => {
    const file = files.find((f) => f.name === presigned.name);
    if (file) {
      return s3Upload(presigned, file);
    }
  });

  const results = await Promise.all(promises);
  return results.filter((r) => r) as PresignedResponse[];
};
