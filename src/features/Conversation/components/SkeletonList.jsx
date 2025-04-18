'use client';

import { Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, prefixCls }) => ({
  message: css`
    display: flex;
    gap: 12px;
    .${prefixCls}-skeleton-header {
      padding: 0;
    }
  `,
  user: css`
    flex-direction: row-reverse;

    .${prefixCls}-skeleton-paragraph {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  `,
}));

const SkeletonList = memo(() => {
  const { cx, styles } = useStyles();

  return (
    <Flexbox gap={24} padding={ 12} style={{ marginTop: 24 }}>
      <Skeleton
        active
        avatar={{ size: 40 }}
        className={cx(styles.message, styles.user)}
        paragraph={{ width: ['50%', '30%'] }}
        title={false}
      />
      <Skeleton
        active
        avatar={{ size: 40 }}
        className={styles.message}
        paragraph={{ width:  ['50%', '30%'] }}
        title={false}
      />
    </Flexbox>
  );
});

export default SkeletonList; 