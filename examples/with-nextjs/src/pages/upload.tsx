import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { useUploadFiles } from "@s3-presigner/client";

const Upload = () => {
  const { data, isLoading, onSelect } = useUploadFiles();

  const { mutateAsync } = useMutation({
    mutationFn: async (input: unknown) => {
      const resp = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await resp.json();
      if (!resp.ok) {
        throw new Error(result.errors.message);
      }

      return { data: result.data };
    },
  });

  const { mutate } = useMutation({
    mutationFn: onSelect(async (input) => {
      const f = await mutateAsync(input);
      return f.data;
    }),
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
