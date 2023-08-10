export type TUploadFileResponse = {
  file: File;
  key: string;
  src: string;
  name: string;
  fileType: string;
  success: boolean;
};

export type TGetUploadUrlsFnRes = {
  key: string;
  src: string;
  name: string;
  fileType: string;
  signedUrl: string;
};

export type TGetUploadUrlsFn = (
  input: {
    readonly name: string;
    readonly size: number;
    readonly type: string;
  }[]
) => Promise<TGetUploadUrlsFnRes[]>;
