import express from "express";

import { verifyAdmin } from "./verifyadmin.js";
import { updateUserById } from "./updateusers.js";
import { deleteUserById } from "./deleteusers.js";
import { getAllUsers, getUserById } from "./getusers.js";
import { getUsersStats } from "./userstats.js";

const AdminRouter = express.Router();

AdminRouter.put("/updateusers/:id", verifyAdmin, updateUserById);
AdminRouter.delete("/deleteusers/:id", verifyAdmin, deleteUserById);
AdminRouter.get("/findusers/:id", verifyAdmin, getUserById);
AdminRouter.get("/findallusers", verifyAdmin, getAllUsers);
AdminRouter.get("/usersstats", verifyAdmin, getUsersStats);

export default AdminRouter;