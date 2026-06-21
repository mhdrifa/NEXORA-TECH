import { Router } from "express";
import { getOrCreateUser } from "../../../src/db/users.ts";
import { requireAuth, AuthRequest } from "../../../src/middleware/auth.ts";

const router = Router();

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const firebaseUser = req.user!;
    const dbUser = await getOrCreateUser(firebaseUser.uid, firebaseUser.email!);
    res.json({ user: dbUser });
  } catch (err: any) {
    console.error("Auth /me error:", err);
    res.status(500).json({ error: "Failed to initialize user session.", details: err.message });
  }
});

export default router;
