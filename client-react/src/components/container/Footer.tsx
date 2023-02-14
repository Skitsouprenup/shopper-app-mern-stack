import React from 'react';

import footerstyle from '../../css/container/footer.scss';

import {IoMdLocate, IoIosMail} from 'react-icons/io';
import {BsFillTelephoneFill} from 'react-icons/bs';

const Footer = () => {
  return (
    <div className={footerstyle['footer-container']}>
      <div className={footerstyle['first-top-level-list']}>

        <div className={footerstyle['list']}>
          <h2>Social Media</h2>
          <div className={footerstyle['list-content']}>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Instagram</p>
          </div>
        </div>
        <div className={footerstyle['list']}>
          <h2>Payment Methods</h2>
          <div className={footerstyle['list-content']}>
            <p>Visa</p>
            <p>Mastercard</p>
          </div>
        </div>

      </div>

      <div className={footerstyle['useful-links-top-level-list']}>
        <h2>Useful Links</h2>
        <div className={footerstyle['useful-links-list']}>
          <div className={footerstyle['list-content']}>
            <p>Customer Support</p>
            <p>FAQ</p>
            <p>Order Dispute</p>
            <p>Order Cancellation</p>
          </div>
          <div className={footerstyle['list-content']}>
            <p>Refund</p>
            <p>Shipping</p>
            <p>Terms and Conditions</p>
          </div>
        </div>
      </div>

      <div className={footerstyle['contact-top-level-list']}>
        <h2>Contact</h2>
        <div className={footerstyle['list']}>
          <div className={footerstyle['list-content']}>
            <p><IoMdLocate />41°24'12.2"N 2°10'26.5"E</p>
            <p><BsFillTelephoneFill />+1-212-456-7890</p>
            <p><IoIosMail />
              Robert Robertson,
              <br/>1234 NW Bobcat Lane,
              <br/> St. Robert, MO 65584-5678
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Footer;