import React, { useEffect, useState } from 'react';

import modalstyle from '../../../css/content/modals/forgotpass.scss';
import CompanyLogo from '../../../assets/images/shopper-company-logo.png';
import { retrievePass }from '../../../scripts/crud/users/retrievepass';

const ForgotPass = 
    (
        { forgotPassModal, setForgotPassModal } :
        {
            forgotPassModal: boolean,
            setForgotPassModal : React.Dispatch<React.SetStateAction<boolean>>
        }    
    ) => {
    const[username, setUsername] = useState<string>('');
    const[message, setMessage] = useState<string>('');
    const[msgColor, setMsgColor] = useState<string>('');
    const[retrieveOpCont, setRetrieveOpCont] = useState<AbortController>();
    const[retrieveOpSig, setRetrieveOpSig] = useState<AbortSignal>();
    const[loading, setLoading] = useState<boolean>(false);
    const[disableApproveBtn, setDisabledApproveBtn] = useState<boolean>(false);

    //Disable approve button if the input field
    //is empty
    useEffect(() => {
        if(username)
            setDisabledApproveBtn(false);
        else setDisabledApproveBtn(true);
    },[username]);

    //Display message whether an email is sent or not
    useEffect(() => {
        const msgTimeout = setTimeout(() => {
            setMessage('');
        }, 2000);

        return () => clearTimeout(msgTimeout);
    },[message]);

    const passwordRetrieval = () => {

        if(username) {
            setLoading(true);

            if(!loading) {
                let signal = null;

                /*
                    if there's no created AbortController,
                    create one
                */
                if(!retrieveOpCont) {
                    const controller = new AbortController();
                    signal = controller.signal;
                    setRetrieveOpCont(controller);
                    setRetrieveOpSig(signal);
                }
                /*
                    Otherwise, abort the controller
                    and the operation. There should
                    be one registered signal before
                    executing the operation
                */
                else {
                    retrieveOpCont.abort();
                    setRetrieveOpCont(undefined);
                    setRetrieveOpSig(undefined);
                    return;
                }
    
                let msgColor = '';
                retrievePass(username, signal).
                then((resp) => {
                    if(resp?.status === 200)
                        msgColor = 'black';
                    else msgColor = 'red';
                    return resp?.text();
                }).
                then((data) => {
                    if(data) {
                        setMessage(data);
                        setMsgColor(msgColor);
                    }
                    setRetrieveOpCont(undefined);
                    setRetrieveOpSig(undefined);
                    setUsername('');
                    setLoading(false);
                }).
                catch((e) => {
                    if(!retrieveOpSig?.aborted)
                        console.error(e);
                    setRetrieveOpCont(undefined);
                    setRetrieveOpSig(undefined);
                    setUsername('');
                    setLoading(false);
                });
            }
        }
    }

    return (
        <>
            <div className={modalstyle['forgotpass-container']}
                 onClick={() => {
                    if(retrieveOpCont) retrieveOpCont.abort();
                    setForgotPassModal(!forgotPassModal);
                 }}>
            </div>
            <div className={modalstyle['forgotpass-content']}>
                <div className={modalstyle['components']}>
                    <div className={modalstyle['company-logo']}>
                        <img alt='Company Logo' src={CompanyLogo} 
                            className={modalstyle['image']}/>
                    </div>
                    <h3>Password Retrieval</h3>

                    <input type="text" 
                        aria-label='username field'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading} />

                    {
                        message && <p style={{color: msgColor}}>
                            {message}
                        </p>
                    }
                    
                    <div className={modalstyle['buttons']}>
                        <button type="button"
                                aria-label='Retrieve Password Button'
                                className={modalstyle['approve-button']}
                                onClick={passwordRetrieval}
                                disabled={
                                    loading ? loading : disableApproveBtn
                                }>
                            {
                                !loading ? 'Retrieve Password' :
                                'Please wait...'
                            }
                        </button>
                        <button type="button"
                                aria-label='Close Button'
                                onClick={() => {
                                    if(retrieveOpCont) retrieveOpCont.abort();
                                    setForgotPassModal(!forgotPassModal);
                                }}
                                className={modalstyle['cancel-button']}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPass;