import express from "express";
import { verifyAdmin } from "../adminroutes/verifyadmin.js";
import { verifyAccessToken } from "../verifyaccesstoken.js";
import { createOrders } from "./createorders.js";
import { deleteOrderById } from "./deleteorders.js";
import { getAllOrders, getOrderById } from "./getorders.js";
import { getMonthlyIncome } from "./orderstats.js";
import { updateOrderById } from "./updateorders.js";

const OrderRouter = express.Router();

OrderRouter.post("/saveorders", verifyAccessToken, createOrders);
OrderRouter.put("/updateorders/:id", verifyAdmin, updateOrderById);
OrderRouter.delete("/deleteorders/:id", verifyAccessToken, deleteOrderById);
OrderRouter.get("/getorders/:userId", verifyAccessToken, getOrderById);
OrderRouter.get("/getallorders", verifyAdmin, getAllOrders);
//stats
OrderRouter.get("/income", verifyAdmin, getMonthlyIncome);

export default OrderRouter;