import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import pagestyle from '../../../css/content/unsubnewsletter.scss';
import CompanyLogo from '../../../assets/images/shopper-company-logo.png';

const UnsubNewsletter = () => {
    const[message, setMessage] = useState<string>('');

    const unsubCode = useParams().unsubCode;
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        let url: string | undefined = process.env.SERVER_DOMAIN;

        if(message) return () => controller.abort();

        if(url) {
            if(unsubCode) {
                url += '/api/newsletter/unsub?unsubcode='+unsubCode;

                const request = new Request(url, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-store',
                    headers: {
                        'Content-Type':'text/plain',
                    },
                });

                fetch(request, {signal}).
                then((resp) => resp.text()).
                then((data) => {
                    if(data) setMessage(data);
                }).
                catch((e) => console.error(e));
            } else {
                console.error('unsub code doesn\'t exist!');
                navigate('/');
            }
        }
        else {
            console.error('Domain is missing!');
            navigate('/');
        }

        return () => controller.abort();
    });

    return (
        <div className={pagestyle['unsubnewsletter-container']}>
            <div className={pagestyle['content']}>
                <div className={pagestyle['company-logo']}>
                        <img alt='Company Logo' src={CompanyLogo} 
                            className={pagestyle['image']}/>
                    </div>
                <p>{message}</p>
                <p className={pagestyle['link']}
                aria-roledescription='button'
                aria-label='go to home button'
                onClick={() => navigate('/')}>
                    Click here to go to home page
                </p>
            </div>
        </div>
    );
};

export default UnsubNewsletter;