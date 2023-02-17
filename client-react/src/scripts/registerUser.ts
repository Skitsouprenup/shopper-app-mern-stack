import { NavigateFunction } from "react-router-dom";
import { userRegistration } from "./crud/users/userregistration";
import { RegistrationCredentials } from "./types/usertypes";
import { acceptableChars, verifyEmail } from "./utilities";

export const registerUser = (
    e : React.MouseEvent<HTMLButtonElement, MouseEvent>,
    firstname: string, lastname: string, username: string,
    password: string, confirmPass: string, email: string,
    middlename: string, navigate: NavigateFunction,
    setError: React.Dispatch<React.SetStateAction<boolean>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorMsg: React.Dispatch<React.SetStateAction<string>>) => {
    e.preventDefault();
    
    if(process.env.NODE_ENV === 'production') {
      //For now, disable register function during production
      alert('Registration is disabled in production.');
      return;
    }

    if(!firstname && !lastname && !username && 
       !password && !confirmPass && !email) {
        setError(true);
        setErrorMsg('Please fill up the required fields!');
        return;
    }

    let inputs = [username, password, confirmPass];
    for(let x of inputs) {
      if(!acceptableChars(x,/^[a-zA-z0-9_-]+$/)) {
        setError(true);
        setErrorMsg(
          `username and password fields must consist of alphanumeric, 
           underscore or hypen characters only!`);
        return;
      }
      if(x.length < 3) {
        setError(true);
        setErrorMsg(
          `username and password fields must have at least 
           three characters!`);
        return;
      }
    }

    inputs = [firstname,lastname];
    for(let x of inputs) {
      if(!acceptableChars(x,/^[a-zA-z0-9-]+$/)) {
        setError(true);
        setErrorMsg(
          `first name and last name fields must consist of alphanumeric 
           or hypen characters only!`);
        return;
      }
      if(x.length < 3) {
        setError(true);
        setErrorMsg(
          `firstname and lastname fields must have at least 
           three characters!`);
        return;
      }
    }

    if(!acceptableChars(middlename,/^[a-zA-z0-9-\.]*$/)) {
        setError(true);
        setErrorMsg(
          `middlename field must consist of alphanumeric 
           or hypen characters only!`);
        return;
    }

    if(password !== confirmPass) {
      setError(true);
      setErrorMsg(`Password and confirmation fields don't match!`);
      return;
    }

    if(!verifyEmail(email)) {
      setError(true);
      setErrorMsg(`Email has invalid characters!`);
      return;
    }

    const credentials : RegistrationCredentials = {
      username,
      email,
      password,
      firstname,
      lastname,
      middlename
    };

    setIsLoading(true);
    userRegistration(
      credentials, 
      setIsLoading, 
      setError, 
      setErrorMsg,
      navigate);

  }