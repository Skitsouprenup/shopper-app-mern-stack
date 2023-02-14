

export const retrievePass = async (username: string, signal: AbortSignal) => {
    let url: string | undefined = process.env.SERVER_DOMAIN;

    if(url && username) {
        url += '/api/users/retrievepass?username='+username;

        const request = new Request(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                'Content-Type':'text/plain',
            },
        });

        return await fetch(request);

    } else console.error("Domain or username is missing!");
};