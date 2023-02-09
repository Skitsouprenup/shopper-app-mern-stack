import React from 'react';
import { IoIosCart } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import Badge from '../Badge';
import navBarStyle from '../../../css/content/navbar.scss';
import { logoutUser } from '../../../scripts/crud/users/userlogout';
import { useAppDispatch, useAppSelector } from '../../../scripts/redux/hooks';
import { startFetchState } from '../../../scripts/redux/slices/userslice';

const NavbarLoggedInBtns = () => {
    const navigate = useNavigate();
    const storeDispatch = useAppDispatch();
    const isFetching = useAppSelector(state => state.user.fetchingUser);

    return (
        <>
            <button aria-label='Profile'
                    onClick={() => navigate('/profile')}>
                Profile
            </button>
            <button aria-label='logout'
                    onClick={() => {
                        if(!isFetching) {
                            storeDispatch(startFetchState());
                            logoutUser(storeDispatch);
                        }
                    }}>
                Logout
            </button>
            <button className={navBarStyle['cart']}
                    aria-label='cart'
                    onClick={() => navigate('/cart')}>
                <IoIosCart className={navBarStyle['cart-button']}/>
                <Badge />
            </button>
        </>
    );
};

export default NavbarLoggedInBtns;