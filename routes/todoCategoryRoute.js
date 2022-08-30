import express from "express";
import databaseConnection from "../connection.js";
import { todoCategoryValidator } from "../middleware/validater.js";

const router = express.Router();

router.post("/create", (req, res) => {
  try {
    const category = req.body;
    if (todoCategoryValidator(category).errors.length > 0) {
      res
        .status(400)
        .send({
          error: [todoCategoryValidator(category).errors],
          status: "failed",
        });
    } else {
      databaseConnection.query(
        `INSERT INTO category (name, user_id) VALUES ('${category.name}', '${category.user_id}')`,
        (error, result) => {
          if (error) res.status(400).send({ status: "failed", error: error });
          else res.status(200).send({ status: "success", result: result });
        }
      );
    }
  } catch (error) {
    res.status(400).send({ status: "failed", error: error });
  }
});

export default router;
