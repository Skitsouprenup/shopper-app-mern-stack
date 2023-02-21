import React from 'react';

import modalstyle from '../../../css/content/modals/displaymodal.scss';
import CompanyLogo from '../../../assets/images/shopper-company-logo.png';

const DisplayModal = 
    ({msg, closeModalFunction} : 
     {msg: string,
      closeModalFunction : Function}) => {
    return (
        <>
            <div className={modalstyle['approvemodal-container']}
                 onClick={() => closeModalFunction()}></div>
            <div className={modalstyle['approvemodal-content']}>
                <div className={modalstyle['components']}>
                    <div className={modalstyle['company-logo']}>
                        <img alt='Company Logo' src={CompanyLogo} 
                            className={modalstyle['image']}/>
                    </div>
                    <h3>{msg}</h3>
                    <button type="button"
                            aria-label='Retrieve Password Button'
                            className={modalstyle['approve-button']}
                            onClick={() => closeModalFunction()}>
                                Close
                    </button>
                </div>
            </div>
        </>
    );
};

export default DisplayModal;