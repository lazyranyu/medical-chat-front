import { memo } from "react"
import { Flexbox } from "react-layout-kit"

import { MAX_SIZE_DESKTOP, MIN_IMAGE_SIZE, useStyles } from "./style"

const Grid = memo(
    ({
         gap = 4,
         col = 3,
         max = MAX_SIZE_DESKTOP,
         min = MIN_IMAGE_SIZE,
         children,
         className,
         style
     }) => {
        const { styles, cx } = useStyles({ col, gap, max, min })

        return (
            <Flexbox
                className={cx(styles.container, className)}
                gap={gap}
                horizontal
                style={style}
            >
                {children}
            </Flexbox>
        )
    }
)

export default Grid
