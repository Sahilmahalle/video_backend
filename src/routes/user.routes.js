import { Router } from "express";
import registerUser, {
  logOutUser,
  loginUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middlewares.js";
import { verifyJWT } from "../middleware/auth.middlewares.js";

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

Router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logOutUser);
export default userRouter;
