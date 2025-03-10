'use client';

import { DraggablePanel, DraggablePanelContainer } from '@lobehub/ui';
import { createStyles, useResponsive } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { PropsWithChildren, memo, useEffect, useState, useMemo } from 'react';

import { FOLDER_WIDTH } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import {globalActionSlice} from "@/store/global/action";

export const useStyles = createStyles(({ css, token }) => ({
  panel: css`
    height: 100%;
    color: ${token.colorTextSecondary};
    background: ${token.colorBgContainer};
  `,
}));

const SessionPanel = memo(({ children }) => {
  const { md = true } = useResponsive();

  const [isPinned] = useQueryState('pinned', parseAsBoolean);
  const { styles } = useStyles();
  
  // 使用单独的选择器获取状态，避免数组选择器在服务器端渲染时的问题
  const sessionsWidth = useGlobalStore(useMemo(() => 
    (s) => systemStatusSelectors.sessionWidth(s), []));
  const sessionExpandable = useGlobalStore(useMemo(() => 
    (s) => systemStatusSelectors.showSessionPanel(s), []));
  const updateSystemStatus = useGlobalStore(useMemo(() => 
    (s) => s.updateSystemStatus, []));
    
  const [cacheExpand, setCacheExpand] = useState(Boolean(sessionExpandable));
  const [tmpWidth, setWidth] = useState(sessionsWidth);
  if (tmpWidth !== sessionsWidth) setWidth(sessionsWidth);

  const handleExpand = (expand) => {
    if (isEqual(expand, sessionExpandable)) return;
    updateSystemStatus({ showSessionPanel: expand });
    setCacheExpand(expand);
  };

  const handleSizeChange = (_, size) => {
    if (!size) return;
    const nextWidth = typeof size.width === 'string' ? Number.parseInt(size.width) : size.width;
    if (!nextWidth) return;

    if (isEqual(nextWidth, sessionsWidth)) return;
    setWidth(nextWidth);
    updateSystemStatus({ sessionWidth: nextWidth });
  };

  useEffect(() => {
    if (md && cacheExpand) updateSystemStatus({ showSessionPanel: true });
    if (!md) updateSystemStatus({ showSessionPanel: false });
  }, [md, cacheExpand, updateSystemStatus]);

  return (
    <DraggablePanel
      className={styles.panel}
      defaultSize={{ width: tmpWidth }}
      // 当进入 pin 模式下，不可展开
      expand={!isPinned && sessionExpandable}
      expandable={!isPinned}
      maxWidth={400}
      minWidth={FOLDER_WIDTH}
      mode={md ? 'fixed' : 'float'}
      onExpandChange={handleExpand}
      onSizeChange={handleSizeChange}
      placement="left"
      size={{ height: '100%', width: sessionsWidth }}
    >
      <DraggablePanelContainer style={{ flex: 'none', height: '100%', minWidth: FOLDER_WIDTH }}>
        {children}
      </DraggablePanelContainer>
    </DraggablePanel>
  );
});

export default SessionPanel;
