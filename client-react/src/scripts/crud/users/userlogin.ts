import { AppDispatch } from "../../redux/reduxstore";
import { errorUserState, loginUserState, startFetchState } from "../../redux/slices/userslice";
import { setUserCredentials } from "./localstorageop/setusercredentials";

type paramstype = { username: string, password: string };
export const loginRequest = (userDispatch: AppDispatch, user: paramstype) => {
    let url: string | undefined = process.env.SERVER_DOMAIN;

    if(url) {
        url += '/api/users/login';
        userDispatch(startFetchState());

        const request = new Request(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            credentials: 'include',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({username: user.username, password: user.password}),
        });

        fetch(request).
            then((resp) => {
                if(resp.status === 200) {
                    return resp.json();
                }
                else {
                    //console.log(resp);
                    userDispatch(errorUserState());
                    return undefined;
                }
            }).
            then((data) => {
                if(data) {
                    type jsonRespType = {accesstoken: string, username: string}
                    const jsonResp : jsonRespType = data;
                    setUserCredentials(jsonResp.username, jsonResp.accesstoken);
                    userDispatch(loginUserState());
                }
                
            }).
            catch((e) => {
                if(e.response) {
                    console.error(e.response.data);
                    console.error(e.response.status);
                }
                else console.error(e);
                userDispatch(errorUserState());
            }); 
    }
    else console.error('Domain Not Found!');
};