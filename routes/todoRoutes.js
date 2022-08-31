import express from "express";
import {
  create,
  getByUserId,
  statusList,
  knowStatusById,
  softDelete,
  patchTodo,
  todoByCategoryId,
} from "../controllers/todoController.js";

import { validateToken } from "../middleware/auth/userAuth.js";

const router = express.Router();

router.post("/create", validateToken, create);

router.get("/user", validateToken, getByUserId);

router.get("/status", statusList);

router.get("/status/:id", validateToken, knowStatusById);

router.delete("/:id", validateToken, softDelete);

router.patch("/:id", validateToken, patchTodo);

router.get("/:id", validateToken, todoByCategoryId);

export default router;
