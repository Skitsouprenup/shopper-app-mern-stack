import React, { useState } from 'react';

import {IoIosSend} from 'react-icons/io';
import newsletterstyle from '../../css/content/newsletter.scss';
import DisplayModal from './modals/DisplayModal';
import LoadingComponent from './LoadingComponent';
import { verifyEmail } from '../../scripts/utilities';

const Newsletter = () => {
  const[email, setEmail] = useState<string>('');
  const[loading, setLoading] = useState<boolean>(false);
  const[showDisplayModal, setShowDisplayModal] = useState<boolean>(false);
  const[displayMsg, setDisplayMsg] = useState<string>('');

  const joinNewsLetter = () => {
    let url: string | undefined = process.env.SERVER_DOMAIN;

    if(url) {
      if(email) {
        if(!verifyEmail(email)) {
          setEmail('');
          setDisplayMsg('Invalid email-address');
          setShowDisplayModal(true);
          return;
        }

        setLoading(true);
        url += '/api/newsletter/join?email='+email;

        const request = new Request(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'default',
        });

        fetch(request).
        then((resp) => {
          if(resp.status === 200) {
            return resp.json();
          }
          throw new Error(resp.statusText);
        }).
        then((data) => {
          if(data?.isJoined) {
            setEmail('');
            setDisplayMsg(email + 
              ' is already registered in the newsletter.');
            setShowDisplayModal(true);
          }
          else {
            setEmail('');
            setDisplayMsg(email + 
              ' has successfully joined the newsletter.' +
              ' We send a notification to your email. Please check your inbox or spam.');
            setShowDisplayModal(true);
          }
          setLoading(false);
        }).
        catch((e) => {
          setLoading(false);
          console.error(e);
        });
      }
      else {
        setDisplayMsg('Empty input');
        setShowDisplayModal(true);
      }

    }
    else console.error('Domain is missing!');
  }

  const closeDisplayModal = () => {
    setDisplayMsg('');
    setShowDisplayModal(false);
  }

  return (
    <>
    {
      showDisplayModal && 
      <DisplayModal 
        msg={displayMsg}
        closeModalFunction={closeDisplayModal}/>
    }
    <div className={newsletterstyle['newsletter-container']}>
      <h1 className={newsletterstyle['title']}>
        Newsletter
      </h1>
      <p>
          Join our newsletter to get latest update about
          products, sales, etc.
      </p>
      {
        loading ? <LoadingComponent /> : 
        (<div className={newsletterstyle['form']}>
          <input type='text' className={newsletterstyle['input-text']}
                 placeholder='E-mail address'
                 value={email}
                 onChange={(e) => setEmail(e.target.value)} />
          <div className={newsletterstyle['submit-button']}
               onClick={joinNewsLetter}>
              <IoIosSend style={{fontSize: '1.75rem'}}/>
              Join
          </div>
        </div>)
      }
    </div>
    </>
  );
};

export default Newsletter;