'use client';

import { useTheme } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import PropTypes from 'prop-types';

import { usePlatform } from '@/hooks/usePlatform';

const Layout = memo(({ children, nav }) => {
    const { isPWA } = usePlatform();
    const theme = useTheme();


    return (
        <>
            <Flexbox
                height={ `calc(100% - 40px)`}
                horizontal
                style={{
                    borderTop: `1px solid ${theme.colorBorder}`,
                    position: 'relative',
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
