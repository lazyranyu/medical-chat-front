/* eslint-disable no-undef */
import { Icon } from "@lobehub/ui"
import { createStyles } from "antd-style"
import { FileImage, FileText, FileUpIcon } from "lucide-react"
import { darken, lighten } from "polished"
import { memo } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { Center, Flexbox } from "react-layout-kit"

import { getContainer, useDragUpload } from "./useDragUpload"
import components from "@/locales/default/components";

const BLOCK_SIZE = 64
const ICON_SIZE = 36

const useStyles = createStyles(({ css, token }) => {
    return {
        container: css`
      width: 320px;
      height: 200px;
      padding: ${token.borderRadiusLG + 4}px;

      background: ${token.geekblue};
      border-radius: 16px;
    `,
        content: css`
      width: 100%;
      height: 100%;
      padding: 16px;

      border: 1.5px dashed #fff;
      border-radius: ${token.borderRadiusLG}px;
    `,
        desc: css`
      font-size: 14px;
      line-height: 22px;
      color: #fff;
    `,
        icon: css`
      color: ${darken(0.05, token.geekblue)};
      background: ${lighten(0.38, token.geekblue)};
      border-radius: ${token.borderRadiusLG}px;
    `,
        iconGroup: css`
      margin-block-start: -44px;
    `,
        title: css`
      font-size: 20px;
      font-weight: bold;
      color: #fff;
    `,
        wrapper: css`
      position: fixed;
      z-index: 9999;
      inset: 0;

      width: 100%;
      height: 100%;

      background: ${token.colorBgMask};

      transition: all 0.3s ease-in-out;
    `
    }
})

const DragUpload = memo(({ enabledFiles = true, onUploadFiles }) => {
    const { styles, theme } = useStyles()
    const { t } = useTranslation("components")

    const isDragging = useDragUpload(onUploadFiles)

    if (!isDragging) return

    return createPortal(
        <Center className={styles.wrapper}>
            <div className={styles.container}>
                <Center className={styles.content} gap={12}>
                    <Flexbox className={styles.iconGroup} horizontal>
                        <Center
                            className={styles.icon}
                            height={BLOCK_SIZE * 1.25}
                            style={{
                                background: lighten(0.32, theme.geekblue),
                                transform: "rotateZ(-20deg) translateX(10px)"
                            }}
                            width={BLOCK_SIZE}
                        >
                            <Icon
                                icon={FileImage}
                                size={{ fontSize: ICON_SIZE, strokeWidth: 1.5 }}
                            />
                        </Center>
                        <Center
                            className={styles.icon}
                            height={BLOCK_SIZE * 1.25}
                            style={{
                                transform: "translateY(-12px)",
                                zIndex: 1
                            }}
                            width={BLOCK_SIZE}
                        >
                            <Icon
                                icon={FileUpIcon}
                                size={{ fontSize: ICON_SIZE, strokeWidth: 1.5 }}
                            />
                        </Center>
                        <Center
                            className={styles.icon}
                            height={BLOCK_SIZE * 1.25}
                            style={{
                                background: lighten(0.32, theme.geekblue),
                                transform: "rotateZ(20deg) translateX(-10px)"
                            }}
                            width={BLOCK_SIZE}
                        >
                            <Icon
                                icon={FileText}
                                size={{ fontSize: ICON_SIZE, strokeWidth: 1.5 }}
                            />
                        </Center>
                    </Flexbox>
                    <Flexbox align={"center"} gap={8} style={{ textAlign: "center" }}>
                        <Flexbox className={styles.title}>
                            {components.DragUpload.dragTitle}
                        </Flexbox>
                        <Flexbox className={styles.desc}>
                            {components.DragUpload.dragDesc}
                        </Flexbox>
                    </Flexbox>
                </Center>
            </div>
        </Center>,
        getContainer()
    )
})

export default DragUpload
