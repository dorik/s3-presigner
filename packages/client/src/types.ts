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

export type GetPresignedUrlsType = (param: string) => Promise<PresignedType[]>;
