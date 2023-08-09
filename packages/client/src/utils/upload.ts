import { array, assert, Describe, number, object, string } from "superstruct";

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
    position: number(),
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
  files: FileList,
  getPresignedUrls: GetPresignedUrlsType
): Promise<PresignedResponse[]> => {
  const filesInfo = Object.values(files).map(
    ({ name, size, type }, position) => ({
      type,
      name,
      size,
      position,
    })
  );
  const data = await getPresignedUrls(filesInfo);
  // validate callback response
  assert(data, PresignedUrlsResponseSchema);

  const promises = data.map((presigned) => {
    const file = files.item(presigned.position);
    if (file) {
      return s3Upload(presigned, file);
    }
  });

  const results = await Promise.all(promises);
  return results.filter((r) => r) as PresignedResponse[];
};
