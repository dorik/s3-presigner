import type {
  PresignedType,
  PresignedResponse,
  GetPresignedUrlsType,
} from "../types";

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
  const names = files.map((f) => f.name);
  const body = JSON.stringify(names);
  const data = await getPresignedUrls(body);
  const promises = data.map((presigned) => {
    const file = files.find((f) => f.name === presigned.name);
    if (file) {
      return s3Upload(presigned, file);
    }
  });

  const results = await Promise.all(promises);
  return results.filter((r) => r) as PresignedResponse[];
};
