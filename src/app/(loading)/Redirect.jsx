'use client';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';

const Redirect = memo(() => {
    const router = useRouter();

    let isLoaded = true;
    let isUserStateInit;
    let isUserHasConversation;
    let isOnboard;
    let isLogin = false;
        // if user auth state is not ready, wait for loading
        if (!isLoaded) return;

        // this mean user is definitely not login
        if (!isLogin) {
            router.replace('/welcome');
            return;
        }

        // // if user state not init, wait for loading
        // if (!isUserStateInit) return;
        //
        // // user need to onboard
        // if (!isOnboard) {
        //     router.replace('/onboard');
        //     return;
        // }
        //
        // // finally check the conversation status
        // if (isUserHasConversation) {
        //     router.replace('/chat');
        // } else {
        //     router.replace('/welcome');
        // }

    return null;
});

export default Redirect;
