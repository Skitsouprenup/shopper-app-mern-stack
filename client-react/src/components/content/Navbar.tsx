import React, { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

import navBarStyle from '../../css/content/navbar.scss';
import CompanyLogo from '../../assets/images/shopper-company-logo.png';
import { useNavigate } from 'react-router-dom';
import NavbarNotLoggedInBtns from './navbar/NotLoggedInBtns';
import NavbarLoggedInBtns from './navbar/LoggedInBtns';
import { checkUserSession } from '../../scripts/crud/users/checkusersession';
import { useAppDispatch, useAppSelector } from '../../scripts/redux/hooks';
import { resetStatus } from '../../scripts/redux/slices/userslice';
import { setCount, setTotalQuantity } from '../../scripts/redux/slices/cartslice';
import { getLocalStorCart } from '../../scripts/crud/cart/localstorageop/getlocalstorcart';

const Navbar = () => {
  const navigate = useNavigate();
  const[userLoading, setUserLoading] = useState<boolean>(true);

  const globalStateDispatch = useAppDispatch();
  const{ status, isLoggedIn } = useAppSelector((state) => state.user);

  //user credentials authorization
  useEffect(() => {
    const controller = new AbortController;
    if(!isLoggedIn)
      checkUserSession(controller.signal, globalStateDispatch);

    return () => controller.abort();
  },[]);

  //init cart
  useEffect(() => {
      if(isLoggedIn) {
        const parsedProducts = getLocalStorCart(isLoggedIn);
      if(parsedProducts.length) {
        let quantityCount = 0;
        let itemCount = 0;

        itemCount += parsedProducts.length;
        for(let x of parsedProducts) {
          quantityCount += x.variations.length;
        }
        globalStateDispatch(setCount(itemCount));
        globalStateDispatch(setTotalQuantity(quantityCount));
      }
    }
  },[isLoggedIn]);

  useEffect(() => {
    if(isLoggedIn) {
      globalStateDispatch(resetStatus());
      setUserLoading(false);
    }
    else if(!isLoggedIn && status === "FAILED") {
      globalStateDispatch(resetStatus());
      setUserLoading(false);
    }
  },[isLoggedIn, status])

  return (
    <div className={navBarStyle['navbar']}>
        <div className={navBarStyle['logo-buttons-container']}>
            <button className={navBarStyle['company-logo']}
                    onClick={() => navigate('/')}>
              <img alt='Company Logo' src={CompanyLogo} 
                   className={navBarStyle['image']}/>
            </button>

            <div className={navBarStyle['right-side-buttons']}>
              {
                userLoading ? <div>Loading...</div> :
                isLoggedIn ? <NavbarLoggedInBtns /> :
                <NavbarNotLoggedInBtns />
              }
            </div>
        </div>

        <div className={navBarStyle['search-container']}>
            <IoIosSearch className={navBarStyle['search-icon']}/>
            <input type='text' className={navBarStyle['search-input']}
                   placeholder='Search'/>
        </div>
    </div>
  );
};

export default Navbar;