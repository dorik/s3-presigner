import { useState } from "react";
import { uploadFiles } from "../utils/upload";
import type { GetPresignedUrlsType, PresignedResponse } from "../types";

export const useUploadFiles = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<PresignedResponse[]>();

  const onSelect = (cb: GetPresignedUrlsType) => async (files: FileList) => {
    setIsLoading(true);
    const data = await uploadFiles(files, cb);
    setData(data);
    setIsLoading(false);
    return data;
  };

  return {
    data,
    onSelect,
    isLoading,
  };
};
