import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css }) => ({
  header: css`
    z-index: 10;
  `,
}));

const SidebarHeader = memo(({ title, style, actions }) => {
  const { styles } = useStyles()

  return (
      <Flexbox
          align={"center"}
          className={styles.header}
          distribution={"space-between"}
          horizontal
          padding={14}
          paddingInline={16}
          style={style}
      >
        <Flexbox align={"center"} gap={4} horizontal width={"100%"}>
          {title}
        </Flexbox>
        <Flexbox align={"center"} gap={2} horizontal>
          {actions}
        </Flexbox>
      </Flexbox>
  )
})

export default SidebarHeader
