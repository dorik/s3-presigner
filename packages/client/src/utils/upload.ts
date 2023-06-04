const s3Upload = async (presigned, file) => {
  const res = await fetch(presigned.signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (res.ok) {
    return [
      presigned.name,
      { message: "File uploaded successfully", success: true, ...presigned },
    ];
  } else {
    return [
      presigned.name,
      { message: "Failed to upload file", success: false, ...presigned },
    ];
  }
};

export const uploadFiles = async (files, getPresignedUrls) => {
  files = [...files];
  const names = files.map((f) => f.name);
  const body = JSON.stringify(names);
  const data = await getPresignedUrls(body);
  const promises = data.map((presigned) => {
    const file = files.find((f) => f.name === presigned.name);
    return s3Upload(presigned, file);
  });
  const results = await Promise.all(promises);

  return new Map(results);
};
