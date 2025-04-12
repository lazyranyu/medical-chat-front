'use client';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react'

import { useUserStore, authSelectors } from '@/store/user';
import { useStoreSelector } from '@/hooks/useStoreSelector';

const Redirect = memo(() => {
    const router = useRouter();
    //todo login
    // const isLogin = useStoreSelector(useUserStore, authSelectors.isLogin);
    const isLogin = false;
    const navToChat = () => {
        // setLoadingStage(AppLoadingStage.GoToChat);
        router.replace('/chat');
    };
    useEffect(() => {
        // // if user auth state is not ready, wait for loading
        // if (!isLoaded) {
        //     setLoadingStage(AppLoadingStage.InitAuth);
        //     return;
        // }

        // this mean user is definitely not login
        if (!isLogin) {
            router.replace('/welcome');
            // navToChat();
            return;
        }

        // // if user state not init, wait for loading
        // if (!isUserStateInit) {
        //     setLoadingStage(AppLoadingStage.InitUser);
        //     return;
        // }

        // // user need to onboard
        // if (!isOnboard) {
        //     router.replace('/onboard');
        //     return;
        // }

        // finally go to chat
         navToChat();
    }, [isLogin]);
    return null;
});

export default Redirect;
