import { useState } from "react";
import { uploadFiles } from "../utils/upload";
import type { TGetUploadUrlsFn, TUploadFileResponse } from "../types";

export const useUploadFiles = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<TUploadFileResponse[]>();

  const onSelect = (callback: TGetUploadUrlsFn) => async (files: FileList) => {
    setIsLoading(true);
    const data = await uploadFiles(files, callback);
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
