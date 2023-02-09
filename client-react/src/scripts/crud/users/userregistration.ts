import React from "react";
import { NavigateFunction } from "react-router-dom";
import { RegistrationCredentials } from "../../types/usertypes";
import { setUserCredentials } from "./localstorageop/setusercredentials";

export const userRegistration = 
    (credentials : RegistrationCredentials,
     setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
     setError: React.Dispatch<React.SetStateAction<boolean>>,
     setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
     navigate: NavigateFunction) => {
    let url: string | undefined = process.env.SERVER_DOMAIN;

    if(url) {
        url += '/api/users/register';

        setError(false);
        const request = new Request(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            credentials: 'include',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(credentials),
        });

        fetch(request).
        then((resp) => {
            if(resp.status === 201 || resp.status == 400) {
                return resp.json();
            }
            else {
                setError(true);
                setErrorMsg(`Sorry, your registration can't be processed at this moment.`);
            }
            setIsLoading(false);
            return undefined;
        }).
        then((jsonResp) => {
            if(jsonResp) {
                if(jsonResp?.credentials) {
                    const username: string = jsonResp.credentials?.username as string;
                    const accesstoken: string = jsonResp.credentials?.accesstoken as string;
                    if(setUserCredentials(username, accesstoken)) {
                        alert(`Registration success! You'll be redirected to home page.`);
                        navigate('/');
                    }
                }
                if(jsonResp?.msg) {
                    setError(true);
                    setErrorMsg(jsonResp?.msg);
                }
            }
        }).
        catch((e) => {
            console.error(e);
            setIsLoading(false);
        })

    } else console.error('Domain Not Found!');
}