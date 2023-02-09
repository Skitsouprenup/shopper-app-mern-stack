import { Decimal128Type } from "./types/producttypes";

export const decimal128ToString = (decimal128 : Decimal128Type | undefined) => {

    if(decimal128) {
        const splitDecimal = decimal128['$numberDecimal'].split('.');
        let result = parseInt(decimal128['$numberDecimal']).toFixed();

        if(splitDecimal.length === 2) {
            result = parseFloat(decimal128['$numberDecimal']).
                     toFixed(splitDecimal[1].length);
        }

        return result;
    }
    else return undefined;
};

export const acceptableChars = (text: string, regex: RegExp) => {
    if(text === '') return true;

    if(new RegExp(regex).test(text)) return true;
    else return false;
}

export const verifyEmail = (emailAddress: string) : boolean => {
    const emailVerificationRegex = 
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!new RegExp(emailVerificationRegex).test(emailAddress)) {
        return false;
    } else return true;
};