export const todoSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    desc: { type: "string" },
    category_id: { type: "int" },
    status_id: { type: "int" },
  },
  required: ["name", "category_id", "status_id"],
};

export const todoCategorySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
};
