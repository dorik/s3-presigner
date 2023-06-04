import { useEffect } from "react";

export const useUploader = (files) => {
  const onChange = (files1) => {
    console.log(files1);
  };

  useEffect(() => {
    console.log(files);
    const bar = "bar";
  }, [files]);

  return {
    onChange,
  };
};
