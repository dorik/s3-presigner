import { array, assert, Describe, object, string } from "superstruct";

import type {
  TGetUploadUrlsFn,
  TGetUploadUrlsFnRes,
  TUploadFileResponse,
} from "../types";

const PresignedUrlsResponseSchema: Describe<TGetUploadUrlsFnRes[]> = array(
  object({
    key: string(),
    src: string(),
    name: string(),
    fileType: string(),
    signedUrl: string(),
  })
);

const s3Upload = async (signedUrl: string, file: File) => {
  const res = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return { success: res.ok };
};

export const uploadFiles = async (
  fileList: FileList,
  getUploadUrls: TGetUploadUrlsFn
): Promise<TUploadFileResponse[]> => {
  const files = Object.values(fileList);
  const filesInfo = files.map(({ name, size, type }) =>
    Object.freeze({ type, name, size })
  );
  const data = await getUploadUrls(filesInfo);
  // validate callback response
  assert(data, PresignedUrlsResponseSchema);

  const promises = data.map(async (presigned) => {
    const { name, signedUrl, ...rest } = presigned;
    const file = files.find((file) => file.name === name);
    if (!file) {
      const error = new Error("The file wasn't found to upload: " + name);
      throw error;
    }

    const uploaded = await s3Upload(signedUrl, file);
    return { ...uploaded, ...rest, name, file };
  });

  return await Promise.all(promises);
};
