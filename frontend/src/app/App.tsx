import React, {useEffect, useState} from 'react';
import {RouterProvider} from 'react-router';
import {router} from './routes';
import {useAppDispatch, useAppSelector} from './store/hooks';
import {logout, selectToken} from './features/authSlice';
import {fetchCurrentUser} from './features/userSlice';

function AppBootstrap() {
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);
    const [ready, setReady] = useState(!localStorage.getItem('accessToken'));

    // Initial bootstrap: if a token is stored, load the user before rendering routes
    useEffect(() => {
        if (token) {
            dispatch(fetchCurrentUser())
                .unwrap()
                .catch(() => {
                    // Token is invalid/expired — clear it
                    dispatch(logout());
                })
                .finally(() => setReady(true));
        }
    }, []);

    // Re-fetch user whenever a new login sets the token
    useEffect(() => {
        if (token && ready) {
            dispatch(fetchCurrentUser());
        }
    }, [token]);

    if (!ready) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: '#F8F6F1',
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '3px solid rgba(201,168,76,0.2)',
                    borderTopColor: '#C9A84C',
                    animation: 'spin 0.8s linear infinite',
                }}/>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return <RouterProvider router={router}/>;
}

export default function App() {
    return <AppBootstrap/>;
}
