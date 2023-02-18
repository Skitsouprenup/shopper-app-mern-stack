import React from "react";
import { ComputedCartProducts } from "../../types/producttypes";
import { computeProducts } from "../products/computecartproducts";

export const initCart = 
    (signal: AbortSignal | undefined,
     setProducts: React.Dispatch<
        React.SetStateAction<Array<ComputedCartProducts>>>,
     isLoggedIn: boolean,
     setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    
    if(signal) {
        computeProducts(signal, isLoggedIn).
        then((resp) => {
            if(resp) {
                return resp?.json();
            } else return undefined;
        }).
        then((data) => {
            if(data) {
                //console.log(data);
                setProducts(data);
            }
            setIsLoading(false);
        }).
        catch((e) => {
            if(!signal?.aborted)
                console.error(e);
            setIsLoading(false);
        });
    }
}