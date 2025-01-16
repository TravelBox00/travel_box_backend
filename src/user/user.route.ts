import express from "express";
import {loginController, refreshTokenController, logoutController} from "./user.controller.ts"
const router = express.Router()

router.get("/", (req, res) => {
    res.send("User main route");
  });

router.use("/login", loginController);
router.use("/login/refresh", refreshTokenController);
router.use("/logout", logoutController);

export default router;
