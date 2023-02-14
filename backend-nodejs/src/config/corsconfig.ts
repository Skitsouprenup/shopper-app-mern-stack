export const corsOptions = 
    (
        includeCredentials : boolean,
        allowedOrigins: Array<string>,
    ) => {

    return {
        origin: (origin: unknown, callback : Function) => {
            if(allowedOrigins.indexOf(origin as string) !== -1){
                callback(null, true);
            } else {
                console.log(allowedOrigins);
                callback(
                    new Error(
                    'Origin ' + origin as string + 
                    ' not allowed!'));
            }
        },
        methods: 'GET,POST,PATCH,DELETE,OPTIONS',
        credentials: includeCredentials,
        optionsSuccessStatus: 200,
    };
};