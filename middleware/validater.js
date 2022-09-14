import { userSchema } from "./schema/userSchema.js";
import { todoSchema, todoCategorySchema } from "./schema/todoSchema.js";
import jsonschema from "jsonschema";

var validator = new jsonschema.Validator();

export const userValidator = (schema) => validator.validate(schema, userSchema);

export const todoValidator = (schema) => validator.validate(schema, todoSchema);

export const todoCategoryValidator = (schema) => validator.validate(schema, todoCategorySchema);
