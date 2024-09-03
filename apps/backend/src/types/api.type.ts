import { z } from "zod";
import { isValidObjectId, type ObjectId } from "mongoose";

export const createObjectId = (message: string) => {
  return z.custom<ObjectId>(
    (val) => {
      const isValid = isValidObjectId(val);
      return isValid;
    },
    {
      message,
    },
  );
};

const objectId = createObjectId("Invalid ID");

const idsform = z.union([objectId, z.array(objectId)]);
export const idparam = z.object(
  {
    id: objectId,
  },
  {
    required_error: "ID is required",
    invalid_type_error: "Invalid ID",
  },
);

export const idsSchema = z.object({
  ids: idsform,
});

export type IdParam = z.infer<typeof idparam>;
export type Ids = z.infer<typeof idsSchema>;
