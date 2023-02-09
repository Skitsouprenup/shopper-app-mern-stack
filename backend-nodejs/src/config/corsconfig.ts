const allowedOrigins = 
[
    'http://localhost:3000', 
    'http://localhost:4000',
];
export const corsOptions = (includeCredentials : boolean) => {

    return {
        origin: (origin: unknown, callback : Function) => {
            if(allowedOrigins.indexOf(origin as string) !== -1){
                callback(null, true);
            } else {
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