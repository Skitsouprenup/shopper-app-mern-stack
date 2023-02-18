import React from 'react';

import { MutatingDots } from 'react-loader-spinner';
import modalstyle from '../../../css/content/modals/loadingmodal.scss';

const LoadingModal = () => {
  return (
    <>
        <div className={modalstyle['loadingmodal-container']}></div>
        <div className={modalstyle['loadingmodal-content']}>
            <MutatingDots 
                height="100"
                width="100"
                color="#4fa94d"
                secondaryColor= '#4fa94d'
                radius='12.5'
                ariaLabel="mutating-dots-loading"
            />Loading
        </div>
    </>
  );
};

export default LoadingModal;