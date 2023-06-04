import { uploadFiles } from "client";

const Upload = () => {
  const handleChange = async (e) => {
    const resp = await uploadFiles(e.target.files, async (body) => {
      return await fetch("/api/upload", { method: "POST", body }).then((res) =>
        res.json()
      );
    });

    console.log({ resp });
  };
  return (
    <div>
      <input onChange={handleChange} type="file" multiple />
    </div>
  );
};

export default Upload;
