import express from "express";
import { checkUserSession } from "./checkusersession.js";

import { createUsers } from "./createusers.js";
import { getUserInfo } from "./getuserinfo.js";
import { retrievePass } from "./retrievepass.js";
import { userLogin } from "./userlogin.js";
import { logoutUser } from "./userlogout.js";

const UserRouter = express.Router();

//Register Route
UserRouter.post("/register", createUsers);
UserRouter.get("/usersession", checkUserSession);
UserRouter.get("/getuserinfo", getUserInfo);
UserRouter.get("/retrievepass", retrievePass);
UserRouter.get("/logout", logoutUser);
UserRouter.post("/login",  userLogin);

export default UserRouter;