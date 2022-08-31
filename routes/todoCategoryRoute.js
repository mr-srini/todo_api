import express from "express";

import {
  patchCategory,
  deleteCategory,
  getByUserId,
  create,
} from "../controllers/todoCategoryController.js";
import { validateToken } from "../middleware/auth/userAuth.js";

const router = express.Router();

router.post("/create", validateToken, create);

router.get("/", validateToken, getByUserId);

// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;
router.delete("/:id", validateToken, deleteCategory);

router.patch("/:id", validateToken, patchCategory);

export default router;
