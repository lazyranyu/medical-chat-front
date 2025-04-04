'use client';

import { useTheme } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import PropTypes from 'prop-types';

import { usePlatform } from '@/hooks/usePlatform';
import AntdWarningDisabler from '@/components/AntdWarningDisabler';

const Layout = memo(({ children, nav }) => {
    const { isPWA } = usePlatform();
    const theme = useTheme();

    return (
        <>
            {/* 禁用 antd 兼容性警告 */}
            <AntdWarningDisabler />
            
            <Flexbox
                height={[
                    '100vh',
                    '-webkit-fill-available',
                    '100dvh'
                ]}
                horizontal
                style={{
                    borderTop: isPWA ? `1px solid ${theme.colorBorder}` : undefined,
                    position: 'relative',
                    // 添加以下保证高度准确计算
                    boxSizing: 'border-box',
                    minHeight: '100dvh' // 防止内容不足时出现空白
                }}
                width={'100%'}
            >
                {nav}
                {children}
            </Flexbox>
        </>
    );
});
Layout.propTypes = {
    children: PropTypes.node.isRequired,
    nav: PropTypes.node.isRequired,
};
Layout.displayName = 'DesktopMainLayout';

export default Layout;
