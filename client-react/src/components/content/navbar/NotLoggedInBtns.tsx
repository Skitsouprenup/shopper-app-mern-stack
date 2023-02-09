import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavbarNotLoggedInBtns = () => {
    const navigate = useNavigate();

    return (
        <>
            <button aria-label='login'
                    onClick={() => navigate('/login')}>
                Login
            </button>
            <button aria-label='register'
                    onClick={() => navigate('/register')}>
                Register
            </button>
        </>
    );
};

export default NavbarNotLoggedInBtns;