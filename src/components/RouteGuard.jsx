'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuthStore from "@/store/auth";
import { selectIsLogin } from "@/store/auth/selectors";
import { App, Skeleton } from 'antd';

const publicPaths = ['/welcome', '/', '/register'];

export default function RouteGuard({ children }) {
    const { message } = App.useApp();
    const router = useRouter();
    const pathname = usePathname();
    const isLogin = useAuthStore(selectIsLogin);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const currentPath = pathname;
            const isPublic = publicPaths.some(path => currentPath.startsWith(path));

            // 状态未初始化完成时不执行
            if (useAuthStore.persist?.hasHydrated?.() === false) return;
            if (!isLogin && !isPublic) {
                message.warning('请先登录');
                router.replace('/welcome');
            }
            setIsChecking(false);
        };

        checkAuth();
    }, [isLogin, pathname, router]);

    if (isChecking) {
        return <Skeleton active paragraph={{ rows: 6 }} />;
    }

    return children;
}
