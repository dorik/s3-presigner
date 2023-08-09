export type PresignedType = {
  key: string;
  src: string;
  name: string;
  fileType: string;
  signedUrl: string;
};

export type PresignedResponse = PresignedType & {
  message: string;
  success: boolean;
};

type GetPresignedUrlsInput = {
  name: string;
  size: number;
  type: string;
};

export type GetPresignedUrlsType = (
  input: GetPresignedUrlsInput[]
) => Promise<PresignedType[]>;
