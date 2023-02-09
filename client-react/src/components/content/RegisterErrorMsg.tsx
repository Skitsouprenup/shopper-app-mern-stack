import React, { useEffect } from 'react';

interface propstype {
    error: boolean,
    setError: React.Dispatch<React.SetStateAction<boolean>>,
    errorMsg: string,
    setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
}

const RegisterErrorMsg = (
    {
        error, 
        setError, 
        errorMsg, 
        setErrorMsg
    } : propstype
) => {

    useEffect(() => {
        const timeout = 
            setTimeout(() => {
                setError(false);
                setErrorMsg('');
            }, 3000);

        return () => clearTimeout(timeout);
    },[error, errorMsg]);

    return (
        <div style={{color: 'red'}}>
            {errorMsg}
        </div>
    );
};

export default RegisterErrorMsg;