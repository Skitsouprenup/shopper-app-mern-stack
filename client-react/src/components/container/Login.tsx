import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import loginstyle from '../../css/container/login.scss';
import { checkUserSession } from '../../scripts/crud/users/checkusersession';
import { loginRequest } from '../../scripts/crud/users/userlogin';
import { useAppDispatch, useAppSelector } from '../../scripts/redux/hooks';
import { AppDispatch } from '../../scripts/redux/reduxstore';
import { resetErrorState, resetStatus } from '../../scripts/redux/slices/userslice';
import GotoHome from '../content/GotoHome';
import ForgotPass from '../content/modals/ForgotPass';

const Login = () => {
    const navigate = useNavigate();
    const[username, setUsername] = useState<string>('');
    const[password, setPassword] = useState<string>('');
    const[forgotPassModal, setForgotPassModal] = useState<boolean>(false);
    const[userLoading, setUserLoading] = useState<boolean>(true);
    const userDispatch = useAppDispatch();
    const{ fetchingUser, errorState, status, isLoggedIn } = 
      useAppSelector((state) => state.user);

    useEffect(() => {
      const controller = new AbortController;
      if(!isLoggedIn) 
        checkUserSession(controller.signal, userDispatch);
  
      return () => controller.abort();
    },[]);

    useEffect(() => {
      if(isLoggedIn) {
        userDispatch(resetStatus());
        navigate(-1);
      }
      else if(!isLoggedIn && status === "FAILED") {
        userDispatch(resetStatus());
        setUserLoading(false);
      }
    },[isLoggedIn, status]);

    type loginMouseEvtType = React.MouseEvent<HTMLButtonElement, MouseEvent>;
    const submitLoginCredentials = (e: loginMouseEvtType) => {
      /*
        preventDefault prevents the default 
        behavior(redirecting to another page) of
        input with type 'submit' from firing. Even though,
        type 'button' may not have the same behavior as
        'submit', I decided to invoke this method because
        type 'button' may behave differently across 
        multiple browsers 
      */
      e.preventDefault();
      if(process.env.NODE_ENV !== 'production') {
        if(!fetchingUser) loginRequest(userDispatch, {username, password});
      }
      else {
        //For now, disable login function during production
        alert('Login function is disabled in production.');
      }
    }; 

    useEffect(() => {
      if(errorState){
        setPassword('');
      }
    },[errorState]);

    if(userLoading) return <div>Loading...</div>;

    return (
      <>
        {
          forgotPassModal && 
          <ForgotPass 
            forgotPassModal={forgotPassModal}
            setForgotPassModal={setForgotPassModal}/>
        }
        <div className={loginstyle['login-container']}>
          <GotoHome />
          {
            !forgotPassModal && (
              <div className={loginstyle['content']}>
                <h2>Login</h2>
                  <form className={loginstyle['form']}>
                    <input 
                      type='text' 
                      placeholder='Username'
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}/>
                    <input 
                      type='password' 
                      placeholder='Password'
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}/>
                    <button 
                      type='button'
                      onClick={submitLoginCredentials}
                      disabled={fetchingUser}>
                      Login
                    </button>
                    {
                      errorState && 
                      <LoginFailedMsg 
                        loginError={errorState}
                        userDispatch={userDispatch}/>
                    }
                    <div className={loginstyle['links']}>
                      <p role='button'
                        aria-roledescription='Forgot password'
                        onClick={() => setForgotPassModal(!forgotPassModal)}>
                          Forgot Password?
                      </p>
                      <p role='button'
                        aria-roledescription='Create new account'
                        onClick={() => navigate('/register')}>
                          Create New Account
                      </p>
                    </div>
                  </form>
              </div>
            )
          }
        </div>
      </>
    );
};

interface LoginFailedProps {
  loginError: boolean,
  userDispatch: AppDispatch,
}
const LoginFailedMsg = ({loginError, userDispatch}: LoginFailedProps) => {

  useEffect(() => {
    const hideMessage = () => {
      userDispatch(resetErrorState());
    };

    const errorTimeout = setTimeout(hideMessage, 1000);

    return () => clearTimeout(errorTimeout);
  },[loginError]);

  return(
    <p style={{color: 'red'}}> Ooops! Can't Login!</p>
  );
};

export default Login;