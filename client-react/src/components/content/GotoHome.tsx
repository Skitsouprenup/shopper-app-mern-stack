import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import gotobtnstyle from '../../css/content/gotohome.scss';

const GotoHome = () => {
    const navigate = useNavigate();

    return (
        <button 
             className={gotobtnstyle['home-button']}
             onClick={() => navigate('/')}>
            <IoIosArrowRoundBack />
        </button>
    );
};

export default GotoHome;