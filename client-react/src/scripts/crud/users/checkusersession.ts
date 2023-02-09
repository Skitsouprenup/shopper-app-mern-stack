import { AppDispatch } from "../../redux/reduxstore";
import { loginUserState, 
         logoutUserState, 
         setFailedStatus, 
         setSuccessStatus, 
         startFetchState } from "../../redux/slices/userslice";
import { CredentialsType } from "../../types/usertypes";
import { getUserCredentials } from "./localstorageop/getusercredentials";
import { setUserCredentials } from "./localstorageop/setusercredentials";

export const checkUserSession = (signal: AbortSignal, userDispatch : AppDispatch) => {
    let url: string | undefined = process.env.SERVER_DOMAIN;

    if(url) {
        userDispatch(startFetchState());
        
        const credentials: CredentialsType = getUserCredentials();
        if(!credentials) {
            //console.error("Credentials Not Found!");
            userDispatch(logoutUserState());
            userDispatch(setFailedStatus());
            return;
        }

        url += '/api/users/usersession?username='+credentials.username;

        const request = new Request(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
            credentials: 'include',
            headers: {
                'Authorization':'Bearer ' + credentials.accesstoken,
            },
        });

        fetch(request, {signal}).
        then((resp) => {
            if(resp.status === 200) {
                return resp.json();
            } else {
                userDispatch(logoutUserState());
                userDispatch(setFailedStatus());
                return undefined;
            }
        }).
        then((data) => {
            if(data) {
                if(data?.username && data?.accesstoken) {
                    userDispatch(loginUserState());
                    userDispatch(setSuccessStatus());
                    setUserCredentials(
                        data.username as string, 
                        data.accesstoken as string
                    );
                } else {
                    console.error(
                        `Can't find username and 
                        access token in the response!`);
                    userDispatch(logoutUserState());
                    userDispatch(setFailedStatus());
                }
            }
        }).
        catch((e) => {
            if(!signal.aborted) {
                console.error(e);
                userDispatch(logoutUserState());
                userDispatch(setFailedStatus());
            }
        });
    }
};