import express from "express";
import databaseConnection from "../connection.js";
import { userValidator } from "../middleware/validater.js";

const router = express.Router();

router.post("/register", (req, res) => {
  const user = req.body;
  console.log(userValidator(user))
  if (userValidator(user).errors.length > 0) {
    res
      .status(400)
      .send({ error: [userValidator(user).errors], status: "failed" });
  } else {
    databaseConnection.query(
      `INSERT INTO user (username, email, password) VALUES ('${user.username}', '${user.email}', '${user.password}')`,
      (error, result) => {
        if (error) res.status(400).send({ status: "failed", error: error });
        else res.status(200).send({ status: "success", result: result });
      }
    );
  }
});

router.get("/login", (req, res) => {});

export default router;
