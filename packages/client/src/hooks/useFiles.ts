import { useState } from "react";
import { uploadFiles } from "../utils/upload";
import type { GetPresignedUrlsType, PresignedResponse } from "../types";

export const useUploadFiles = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<PresignedResponse[]>();

  const onUpload = (cb: GetPresignedUrlsType) => async (files: File[]) => {
    setIsLoading(true);
    const data = await uploadFiles(files, cb);
    setData(data);
    setIsLoading(false);
    return data;
  };

  return {
    data,
    isLoading,
    onUpload,
  };
};
