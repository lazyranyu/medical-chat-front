import { createStyles } from "antd-style"

export const MIN_IMAGE_SIZE = 64
export const MAX_SIZE_DESKTOP = 200
export const MAX_SIZE_MOBILE = 90
export const useStyles = createStyles(({ css }, { col, gap, max, min }) => ({
    container: css`
        display: grid;
        grid-gap: ${gap}px;
        grid-template-columns: repeat(${col}, 1fr);

        width: 100%;
        max-width: ${max}px;

        & > div {
            width: 100%;
            min-width: ${min}px;
            min-height: ${min}px;
            max-height: ${(max - gap * (col - 1)) / col}px;
        }
    `
}))
