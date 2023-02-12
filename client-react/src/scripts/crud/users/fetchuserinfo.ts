import { NavigateFunction } from "react-router-dom";
import { CredentialsType, FetchedUser } from "../../types/usertypes";
import { getUserCredentials } from "./localstorageop/getusercredentials";
import { setUserCredentials } from "./localstorageop/setusercredentials";


export const fetchUserInfo = 
    (
     signal: AbortSignal, 
     setUserInfo: React.Dispatch<React.SetStateAction<FetchedUser | undefined>>,
     setLoading: React.Dispatch<React.SetStateAction<boolean>>,
     navigate: NavigateFunction,
    ) => {

    let url: string | undefined = process.env.SERVER_DOMAIN;

    if(url) {

        const credentials: CredentialsType = getUserCredentials();
        if(!credentials) {
            //console.error("Credentials Not Found!");
            navigate(-1);
            return;
        }
        url += '/api/users/getuserinfo?username='+credentials.username;

        const request = new Request(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
            credentials: 'include',
            headers: {
                'Authorization':'Bearer ' + credentials.accesstoken,
                'Content-Type':'application/json',
            },
        });

        fetch(request, {signal}).
        then((resp) => {
            if(resp.status === 200) {
                return resp.json();
            } else navigate(-1);
        }).
        then((data) => {
            if(data) {
                setUserInfo(data as FetchedUser);
                setLoading(false);
                setUserCredentials(
                    data.username as string, 
                    data.accesstoken as string
                );
            }
        }).
        catch((e) => {
            console.error(e);
        });

    } else console.error('Domain is missing!');
};