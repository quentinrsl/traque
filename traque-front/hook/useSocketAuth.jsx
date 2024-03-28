import {useEffect, useState} from 'react';
import { useSocketListener } from './useSocketListener';
import { useLocalStorage } from './useLocalStorage';
import { usePathname } from 'next/navigation';

const LOGIN_MESSAGE = "login";
const LOGIN_RESPONSE_MESSAGE = "login_response";

export function useSocketAuth(socket, passwordName) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [waitingForResponse, setWaitingForResponse] = useState(true);
    const [savedPassword, setSavedPassword, savedPasswordLoading] = useLocalStorage(passwordName, null);
    
    useEffect(() => {
        if (savedPassword && !loggedIn) {
            socket.emit(LOGIN_MESSAGE, savedPassword);
        }
    }, [savedPassword]);

    function login(password) {
        setSavedPassword(password)
    }

    useSocketListener(socket, LOGIN_RESPONSE_MESSAGE,(loginResponse) => {
        setWaitingForResponse(false);
        setLoggedIn(loginResponse);
    });

    useEffect(() => {
        //There is a password saved and we recieved a login response
        if(savedPassword && !waitingForResponse && !savedPasswordLoading) {
            setLoading(false);
        }
        //We tried to load the saved password but it is not there
        else if (savedPassword == null && !savedPasswordLoading) {
            setLoading(false);
        }
    }, [waitingForResponse, savedPasswordLoading, savedPassword]);


    return {login,password: savedPassword, loggedIn, loading};
}