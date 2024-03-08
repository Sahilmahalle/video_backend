import { Router } from "express";
import registerUser from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middlewares.js";

const userRouter = Router();
userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
); //here i solve a problem that i accidently type ./register instead of /register thats why I got error 404

export default userRouter;
