import {
  any,
  array,
  enums,
  string,
  object,
  number,
  optional,
  Describe,
} from "superstruct";

import type { createS3PresignedUrlInput } from "../types";

export const createS3PresignedUrlInputValidator: Describe<createS3PresignedUrlInput> =
  object({
    bucket: string(),
    prefix: optional(string()),
    expiresIn: optional(number()),
    acl: optional(enums(["private", "public-read"])),
    configuration: optional(any()),
  });

export const FilesInfoSchema = array(
  object({
    name: string(),
    size: number(),
    type: string(),
    position: number(),
  })
);
