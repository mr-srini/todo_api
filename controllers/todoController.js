import { todoValidator } from "../middleware/validater.js";
import databaseConnection from "../connection.js";
import { decodeToken } from "../middleware/auth/userAuth.js";

export const create = (req, res) => {
  const todo = req.body;
  if (todoValidator(todo).errors.length > 0) {
    res
      .status(400)
      .send({ error: [todoValidator(todo).errors], status: "failed" });
  } else {
    // The outer [SELECT] query is to eliminate data inconsistancy
    // Situation: user with no category id shouldn't be able to insert
    // OUTER DATA QUERY
    databaseConnection.query(
      `SELECT * FROM category c where c.user_id = ${decodeToken(req)} and c.id = ${req.body.category_id}`,
      (er1, res1) => {
        if (er1) {
          res.status(400).send({ status: "failed", error: er1 });
        } else if (res1.length != 0) {
          // INSERT
          // INNER DATA QUERY
          databaseConnection.query(
            `INSERT INTO todo (name, description, user_id, category_id, status_id)
            VALUES ('${todo.name}', '${todo.desc}', '${decodeToken(req)}', '${
              todo.category_id
            }', '${todo.status_id}')`,
            (error, result) => {
              if (error)
                res.status(400).send({ status: "failed", error: error });
              else res.status(200).send({ status: "success", result: result });
            }
          );
        } else {
          // FAILED
          res.status(400).send({
            error: `category id ${req.body.category_id} doesn't belong to user 
            or category id doesn't exits`,
            status: "failed",
          });
        }
      }
    );
  }
};

export const getByUserId = (req, res) => {
  databaseConnection.query(
    `SELECT t.*, c.name as c_name, s.name as s_name FROM todo as t
    join category as c
    on t.category_id = c.id
    join status as s
    on t.status_id = s.id
    where t.user_id = ${decodeToken(req)}`,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
};

export const statusList = (req, res) => {
  databaseConnection.query("SELECT * FROM status", (error, result) => {
    if (error) res.status(400).send({ status: "failed", error: error });
    else res.send({ data: result, status: "success" });
  });
};

export const knowStatusById = (req, res) => {
  databaseConnection.query(
    `select * from todo.status s
    where s.id = 
    (select t.status_id from todo.todo t where t.id = ${
      req.params.id
    } and t.user_id = ${decodeToken(req)}) `,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
};

export const softDelete = (req, res) => {
  databaseConnection.query(
    `UPDATE todo 
      SET todo.is_active = 0
      WHERE todo.id = ${req.params.id} and todo.user_id = ${decodeToken(req)}`,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
};

export const patchTodo = (req, res) => {
  databaseConnection.query(
    `UPDATE todo 
      SET ?
      WHERE ? AND todo.user_id = ${decodeToken(req)}`,
    [req.body, { id: req.params.id }],
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
};

export const todoByCategoryId = (req, res) => {
  databaseConnection.query(
    // CATEGORY NAME, STATUS NAME
    `SELECT * FROM todo
  WHERE todo.category_id=${req.params.id} AND todo.user_id=${decodeToken(req)}`,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
};
