import { Router } from "express";
import {
  criarGrupo,
  listarGrupos,
  buscarGrupoPorId,
  atualizarGrupo,
  deletarGrupo,
} from "../controllers/grupos.controller.js";

const router = Router();

router.post("/", criarGrupo);
router.get("/", listarGrupos);
router.get("/:id", buscarGrupoPorId);
router.put("/:id", atualizarGrupo);
router.delete("/:id", deletarGrupo);

export default router;
