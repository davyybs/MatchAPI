import { Router } from "express";
import {
  criarUsuario,
  listarUsuarios,
  listarUsuariosPorID,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/usuarios.controller.js";

const router = Router();

router.post("/", criarUsuario);
router.get("/", listarUsuarios);
router.get("/:id", listarUsuariosPorID);
router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;
