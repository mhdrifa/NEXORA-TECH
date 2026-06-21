import { Router } from "express";
import authRouter from "../auth/routes/auth.ts";
import cmsRouter from "./api-cms.ts";
import clientRouter from "./api-client.ts";
import filesRouter from "./api-files.ts";
import emailRouter from "./api-email.ts";

const router = Router();

router.use("/auth", authRouter);
router.use("/cms", cmsRouter);
router.use("/client", clientRouter);
router.use("/files", filesRouter);
router.use("/email", emailRouter);

export default router;
