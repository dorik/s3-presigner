import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { useUploadFiles } from "@s3-presigner/client";

const Upload = () => {
  const { data, isLoading, onUpload } = useUploadFiles();

  const { mutate } = useMutation({
    mutationFn: onUpload((body: string) =>
      fetch("/api/upload", { method: "POST", body }).then((res) => res.json())
    ),
  });

  const handleChange = (e) => {
    mutate(e.target.files);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      {isLoading && "uploading..."}
      <br />
      <input onChange={handleChange} type="file" multiple />
    </div>
  );
};

export default Upload;
