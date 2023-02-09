import React from 'react';

import {IoIosSend} from 'react-icons/io';
import newsletterstyle from '../../css/content/newsletter.scss';

const Newsletter = () => {
  return (
    <div className={newsletterstyle['newsletter-container']}>
        <h1 className={newsletterstyle['title']}>
          Newsletter
        </h1>
        <p>
            Join our newsletter to get latest update about
            products, sales, etc.
        </p>
        <div className={newsletterstyle['form']}>
          <input type='text' className={newsletterstyle['input-text']}
                 placeholder='E-mail address'/>
          <div className={newsletterstyle['submit-button']}>
              <IoIosSend style={{fontSize: '1.75rem'}}/>
              Join
          </div>
        </div>
    </div>
  );
};

export default Newsletter;