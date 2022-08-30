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
    // The outer [SELECT] query is to eliminate data inconsistancy
    // Situation: user with no category id shouldn't be able to insert

    databaseConnection.query(
      `SELECT * FROM category c
    where c.user_id = ${req.body.user_id} and c.id = ${req.body.category_id}`,
      (er1, res1) => {
        if (er1) {
          res.status(400).send({ status: "failed", error: er1 });
        } else if (res1.length != 0) {
          databaseConnection.query(
            `INSERT INTO todo (name, description, user_id, category_id, status_id)
          VALUES ('${todo.name}', '${todo.desc}', '${todo.user_id}', '${todo.category_id}', '${todo.status_id}')`,
            (error, result) => {
              if (error)
                res.status(400).send({ status: "failed", error: error });
              else res.status(200).send({ status: "success", result: result });
            }
          );
        } else {
          res.status(400).send({
            error: `category id ${req.body.category_id} doesn't belong to user ${req.body.user_id} or category id doesn't exits`,
            status: "failed",
          });
        }
      }
    );
  }
});

router.get("/user/:user_id", (req, res) => {
  databaseConnection.query(
    `SELECT * FROM todo WHERE todo.user_id = ${req.params.user_id} AND todo.is_active=1`,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
});

router.get("/status", (req, res) => {
  databaseConnection.query("SELECT * FROM status", (error, result) => {
    if (error) res.status(400).send({ status: "failed", error: error });
    else res.send({ data: result, status: "success" });
  });
});

router.get("/status/:id", (req, res) => {
  databaseConnection.query(
    `select * from todo.status s
  where s.id = (select t.status_id from todo.todo t 
  where t.id = ${req.params.id})`,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
});

router.delete("/:id/:user_id", (req, res) => {
  databaseConnection.query(
    `UPDATE todo 
    SET todo.is_active = 0
    WHERE todo.id = ${req.params.id} and todo.user_id = ${req.params.user_id}`,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
});

router.patch("/:id/:user_id", (req, res) => {
  databaseConnection.query(
    `UPDATE todo 
    SET ?
    WHERE ? AND todo.user_id = ${req.params.user_id}`,
    [req.body, { id: req.params.id }],
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
});

export default router;
