
export const setUserCredentials = 
    (username: string, accesstoken: string) => {
    
    if(!username && !accesstoken)
        return false;

    localStorage.setItem(
        'credentials', 
        JSON.stringify(
        {
            username,
            accesstoken
        }));
    return true;
};