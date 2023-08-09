import { string, optional, object, number, Describe, enums } from "superstruct";
import type { createS3PresignedUrlInput } from "../types";

export const createS3PresignedUrlInputValidator: Describe<createS3PresignedUrlInput> =
  object({
    bucket: string(),
    prefix: optional(string()),
    expiresIn: optional(number()),
    acl: optional(enums(["private", "public-read"])),
  });
