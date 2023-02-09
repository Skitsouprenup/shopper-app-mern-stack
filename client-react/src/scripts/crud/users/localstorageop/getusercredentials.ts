
export const getUserCredentials = <T>() : T => {

    return JSON.parse(localStorage.getItem('credentials') as string);
};