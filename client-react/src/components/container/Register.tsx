import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import registerstyle from '../../css/container/register.scss';
import { registerUser } from '../../scripts/registerUser';
import GotoHome from '../content/GotoHome';
import RegisterErrorMsg from '../content/RegisterErrorMsg';

const Register = () => {
  const navigate = useNavigate();

  const[firstname, setFirstname] = useState<string>('');
  const[lastname, setlastname] = useState<string>('');
  const[middlename, setMiddlename] = useState<string>('');

  const[username, setUsername] = useState<string>('');
  const[password, setPassword] = useState<string>('');
  const[confirmPass, setConfirmPass] = useState<string>('');
  const[email, setEmail] = useState<string>('');
  
  const[error, setError] = useState<boolean>(false);
  const[errorMsg, setErrorMsg] = useState<string>('');

  const[isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className={registerstyle['register-container']}>
      <GotoHome />
      <form className={registerstyle['form']}>
        <h2>Create an Account</h2>
        <div className={registerstyle['input-container']}>
          <div className={registerstyle['column']}>
            <input type='text' 
                   placeholder='Username(required)'
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}/>
            <input type='text' 
                   placeholder='Email(required)'
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}/>
            <input type='password' 
                   placeholder='Password(required)'
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}/>
            <input type='password' 
                   placeholder='Confirm Password(required)'
                   value={confirmPass}
                   onChange={(e) => setConfirmPass(e.target.value)}/>
          </div>
          <div className={registerstyle['column']}>
            <input type='text' 
                   placeholder='Firstname(required)'
                   value={firstname}
                   onChange={(e) => setFirstname(e.target.value)}/>
            <input type='text' 
                   placeholder='Lastname(required)'
                   value={lastname}
                   onChange={(e) => setlastname(e.target.value)}/>
            <input type='text' 
                   placeholder='Middle Initial'
                   value={middlename}
                   onChange={(e) => setMiddlename(e.target.value)}/>
          </div>
        </div>
        <p>
          By creating an account in this platform, I consent to
          the processing of my personal data that I provided here
          in accordance with <span role='button'><b>Privacy Policy</b></span> 
        </p>
        {
          isLoading ? <div>Loading...</div> :
          <button type='button'
                  aria-label='create account'
                  onClick={(e) => {
                    registerUser(
                      e, firstname, lastname, username,
                      password, confirmPass, email, 
                      middlename, navigate, setError,
                      setIsLoading, setErrorMsg);
                  }}>
          Create Account
          </button>
        }
        {
          error && 
            <RegisterErrorMsg 
              error={error}
              setError={setError}
              errorMsg={errorMsg}
              setErrorMsg={setErrorMsg} />
        }
      </form>
    </div>
  );
};

export default Register;