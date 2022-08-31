import databaseConnection from "../connection.js";
import { todoCategoryValidator } from "../middleware/validater.js";
import { decodeToken } from "../middleware/auth/userAuth.js";

export const patchCategory = (req, res) => {
  databaseConnection.query(
    `UPDATE category 
      SET ?
      WHERE ? AND category.user_id = ${decodeToken(req)}`,
    [req.body, { id: req.params.id }],
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
};

export const deleteCategory = (req, res) => {
  databaseConnection.query(
    `UPDATE category 
      SET category.is_active = 0
      WHERE category.id = ${req.params.id} AND category.user_id = ${decodeToken(req)}`,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
};

export const getByUserId = (req, res) => {
  databaseConnection.query(
    `SELECT * FROM category WHERE category.user_id = ${decodeToken(req)} AND category.is_active=1`,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else res.send({ data: result, status: "success" });
    }
  );
};

export const create = (req, res) => {
  try {
    const category = req.body;
    if (todoCategoryValidator(category).errors.length > 0) {
      res.status(400).send({
        error: [todoCategoryValidator(category).errors],
        status: "failed",
      });
    } else {
      databaseConnection.query(
        `INSERT INTO category (name, user_id) VALUES ('${category.name}', '${decodeToken(req)}')`,
        (error, result) => {
          if (error) res.status(400).send({ status: "failed", error: error });
          else res.status(200).send({ status: "success", result: result });
        }
      );
    }
  } catch (error) {
    console.log(error)
    res.status(400).send({ status: "failed", error: error });
  }
};
