export const todoSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    desc: { type: "string" },
    user_id: { type: "int" },
    category_id: { type: "int" },
    status_id: { type: "int" },
  },
  required: ["name", "user_id", "category_id", "status_id"],
};

export const todoCategorySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    user_id: { type: "int" },
  },
  required: ["name", "user_id"],
};
