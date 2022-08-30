import express from "express";
import databaseConnection from "../connection.js";
import { todoCategoryValidator } from "../middleware/validater.js";
import {
  patchCategory,
  deleteCategory,
  getByUserId,
  create,
} from "../controllers/todoCategoryController.js";

const router = express.Router();

router.post("/create", create);

router.get("/:user_id", getByUserId);

// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;
router.delete("/:id/:user_id", deleteCategory);

router.patch("/:id/:user_id", patchCategory);

export default router;
