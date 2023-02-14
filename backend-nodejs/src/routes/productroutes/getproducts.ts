//import util from 'util';
import {Request, Response} from "express";
import LikeModel from "../../models/LikeModel.js";

import ProductModel from "../../models/ProductModel.js";
import { productPageProjection, productShorthandProjection } from "../../getproductsprojections.js";
import { productSortOptions } from "../../utilities.js";

export const getProductById = async (req: Request, res: Response) => {

    if(!req.params.id) {
        console.error('ID is undefined');
        res.sendStatus(500);
    }

    try{
        const product = await ProductModel.findById(req.params.id, {}, productPageProjection);
        res.status(200).json(product);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getProductByTitle = async (req: Request, res: Response) => {
    const titleQuery : string | undefined = req.params.title;

    if(!titleQuery) {
        console.error('Title is undefined');
        res.sendStatus(500);
    }

    try{
        const product = await 
            ProductModel.find(
                { 
                    /*
                        This regex pattern is good for searching
                        a keyword in any part of a title. However,
                        this may impact our app performance.

                        If searching becomes slower, better use
                        this pattern ^keyword.*

                        The pattern above, matches title starting
                        from the beginning of the title. This
                        is not equivalent to the current pattern.
                        However, this is much faster according
                        to mongodb docs.
                    */
                    title : { $regex: `[.]*${titleQuery}[.]*`}, 
                }, {}, productPageProjection);
        res.status(200).json(product);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    try{
        const sort = req.query?.sort?.toString();
        const count: unknown = req.query?.count ? req.query.count : 5;
        const category = req.query?.category?.toString();
        const showPopular = req.query?.showPopular?.toString() === 'true' ? true : false;
        let products = null;

        if(showPopular) {

            type popularProductsType = [
                {
                    products: [{
                        _id: string,
                        title: string,
                        imgPrimary: string,
                    }]
                }
            ];

            const popularProducts: popularProductsType = await LikeModel.aggregate([
                {
                    $addFields: {
                        fk: {$objectToArray: "$product"},
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'fk.1.v',
                        foreignField: '_id',
                        pipeline: [{
                            $project: {
                                _id: 1,
                                title: 1,
                                imgPrimary: 1,
                            }
                        }],
                        as: 'products'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        products: 1,
                    }
                },
                {
                    $limit: typeof count === 'number' ? count : 0
                },
                {
                    $sort: { likeCount: -1}
                }
                
            ]) as popularProductsType;
            const output = popularProducts.map((item) => item.products[0]);
            //console.log(util.inspect(output, false, null, true));
            if(process.env.NODE_ENV === 'production') {
                res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
            }
            res.status(200).json(output);
        }
        else {
            const filter = 
            category ? {categories : { $regex: `^${category.toLowerCase()}$`}} : {};
            
            products = 
                await ProductModel.
                    find(filter, productShorthandProjection).
                    sort(productSortOptions(sort)).
                    limit(typeof count === 'number' ? count : 0);
            //console.log(util.inspect(products, false, null, true));
            if(process.env.NODE_ENV === 'production') {
                res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
            }
            res.status(200).json(products);
        }
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
};