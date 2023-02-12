import express from "express";
import { verifyAdmin } from "../adminroutes/verifyadmin.js";
import { createProducts } from "./createproducts.js";
import { updateProductById } from "./updateproducts.js";
import { deleteProductById } from "./deleteproducts.js";
import { getAllProducts, getProductById, getProductByTitle } from "./getproducts.js";
import { computeCartProductsTotal } from "./computecartproductstotal.js";
import { likeProduct, verifyLike } from "./productlikestatus.js";

const ProductRouter = express.Router();

ProductRouter.post("/saveproducts", verifyAdmin, createProducts);
ProductRouter.put("/updateproducts/:id", verifyAdmin, updateProductById);
ProductRouter.delete("/deleteproducts/:id", verifyAdmin, deleteProductById);
ProductRouter.get("/getproducts/id/:id", getProductById);
ProductRouter.get("/getproducts/title/:title", getProductByTitle);
ProductRouter.get("/getallproducts", getAllProducts);
ProductRouter.get("/verifylike", verifyLike);
ProductRouter.get("/setlike", likeProduct);
ProductRouter.post("/getcartproducts", computeCartProductsTotal);

export default ProductRouter;