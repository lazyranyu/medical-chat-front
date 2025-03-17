import { useResponsive } from "antd-style"
import { memo, useMemo, useEffect } from "react"
import { Flexbox } from "react-layout-kit"

import Grid from "./Grid"
import { MAX_SIZE_DESKTOP, MAX_SIZE_MOBILE } from "./style"

const GalleyGrid = memo(({ items, renderItem: Render }) => {
  // 添加调试日志
  useEffect(() => {
    console.log('GalleyGrid 接收到的图片列表:', items);
  }, [items]);

  // 确保items是数组
  const safeItems = useMemo(() => {
    if (!items || !Array.isArray(items)) {
      console.error('GalleyGrid: items不是数组', items);
      return [];
    }
    return items;
  }, [items]);

  const { firstRow, lastRow } = useMemo(() => {
    if (safeItems.length === 0) {
      return { firstRow: [], lastRow: [] };
    }
    
    if (safeItems.length === 4) {
      return {
        firstRow: safeItems.slice(0, 2),
        lastRow: safeItems.slice(2, 4)
      }
    }

    const firstCol = safeItems.length > 4 ? 3 : safeItems.length

    return {
      firstRow: safeItems.slice(0, firstCol),
      lastRow: safeItems.slice(firstCol, safeItems.length)
    }
  }, [safeItems])

  const { gap, max } = useMemo(() => {
    if (firstRow.length === 0) {
      return { gap: 6, max: MAX_SIZE_DESKTOP };
    }
    
    let scale = firstRow.length * (firstRow.length / safeItems.length)

    scale = scale < 1 ? 1 : scale

    return {
      gap: 6,
      max: (MAX_SIZE_DESKTOP) * scale
    }
  }, [safeItems, firstRow])

  // 如果没有项目，不渲染任何内容
  if (safeItems.length === 0) {
    return null;
  }

  return (
    <Flexbox gap={gap}>
      <Grid col={firstRow.length} gap={gap} max={max}>
        {firstRow.map((i, index) => (
          <Render {...i} index={index} key={i.id || index} />
        ))}
      </Grid>
      {lastRow.length > 0 && (
        <Grid col={firstRow.length} gap={gap} max={max}>
          {lastRow.map((i, index) => (
            <Render {...i} index={index} key={i.id || index} />
          ))}
        </Grid>
      )}
    </Flexbox>
  )
})

export default GalleyGrid
