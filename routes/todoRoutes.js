import express from "express";
import databaseConnection from "../connection.js";
import { todoValidator } from "../middleware/validater.js";

const router = express.Router();

router.post("/create", (req, res) => {
  const todo = req.body;
  if (todoValidator(todo).errors.length > 0) {
    res
      .status(400)
      .send({ error: [todoValidator(todo).errors], status: "failed" });
  } else {
    databaseConnection.query(
      `INSERT INTO todo (name, description, user_id, category_id, status_id) VALUES ('${todo.name}', '${todo.desc}', '${todo.user_id}', '${todo.category_id}', '${todo.status_id}')`,
      (error, result) => {
        if (error) res.status(400).send({ status: "failed", error: error });
        else res.status(200).send({ status: "success", result: result });
      }
    );
  }
});

export default router;