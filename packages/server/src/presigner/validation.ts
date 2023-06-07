import { string, optional, object, number, Describe } from "superstruct";
import type { createS3PresignedUrlInput } from "../types";

export const createS3PresignedUrlInputValidator: Describe<createS3PresignedUrlInput> =
  object({
    bucket: string(),
    acl: optional(string()),
    prefix: optional(string()),
    expiresIn: optional(number()),
  });
