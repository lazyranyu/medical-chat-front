'use client';
import {
    AlipayOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoOutlined,
    UserOutlined,
    WeiboOutlined
} from "@ant-design/icons"
import {
    LoginFormPage,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText
} from "@ant-design/pro-components"

const iconStyles = {
    color: "rgba(0, 0, 0, 0.2)",
    fontSize: "18px",
    verticalAlign: "middle",
    cursor: "pointer"
}
import { useRouter } from "next/navigation"
import {memo, useState} from "react";
import {Divider, message, Space, Tabs, theme} from "antd";
import {login} from "@/services/auth";

export const LoginForm = memo(() => {
    const [loginType, setLoginType] = useState("phone")
    const {token} = theme.useToken()
    const router = useRouter()
    const onFinish = async (values) => {
        try {
            await login(values);
            message.success('登录成功');
            router.push('/chat');
        } catch (error) {
            message.error(error.message || '登录失败');
        }
    };
    return (
        <div
            style={{
                height: "50%",
                width: "100%",
                borderRadius: "20px", // 与Modal保持相同数值
                overflow: "hidden" // 新增防止内容溢出
            }}
        >
            <LoginFormPage
                onFinish={onFinish}
                backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                logo="https://github.githubassets.com/favicons/favicon.png"
                backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
                title="Github"
                style={{paddingTop: 0}}
                containerStyle={{
                    backgroundColor: "rgba(0, 0, 0,0.65)",
                    backdropFilter: "blur(4px)",
                    margin: 0,
                    padding: 0
                }}
                subTitle="全球最大的代码托管平台"
                actions={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column"
                        }}
                    >
                        <Divider plain>
                      <span
                          style={{
                              color: token.colorTextPlaceholder,
                              fontWeight: "normal",
                              fontSize: 14
                          }}
                      >
                        其他登录方式
                      </span>
                        </Divider>
                        <Space align="center" size={24}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    height: 40,
                                    width: 40,
                                    border: "1px solid " + token.colorPrimaryBorder,
                                    borderRadius: "50%"
                                }}
                            >
                                <AlipayOutlined style={{...iconStyles, color: "#1677FF"}}/>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    height: 40,
                                    width: 40,
                                    border: "1px solid " + token.colorPrimaryBorder,
                                    borderRadius: "50%"
                                }}
                            >
                                <TaobaoOutlined style={{...iconStyles, color: "#FF6A10"}}/>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    height: 40,
                                    width: 40,
                                    border: "1px solid " + token.colorPrimaryBorder,
                                    borderRadius: "50%"
                                }}
                            >
                                <WeiboOutlined style={{...iconStyles, color: "#1890ff"}}/>
                            </div>
                        </Space>
                    </div>
                }
            >
                <Tabs
                    centered
                    activeKey={loginType}
                    onChange={activeKey => setLoginType(activeKey)}
                    tabBarStyle={{marginBottom: 0}}
                >
                    <Tabs.TabPane key={"account"} tab={"账号密码登录"}/>
                    <Tabs.TabPane key={"phone"} tab={"手机号登录"}/>
                </Tabs>
                {loginType === "account" && (
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: "large",
                                prefix: (
                                    <UserOutlined
                                        style={{
                                            color: token.colorText
                                        }}
                                        className={"prefixIcon"}
                                    />
                                )
                            }}
                            placeholder={"用户名: admin or user"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入用户名!"
                                }
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: "large",
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText
                                        }}
                                        className={"prefixIcon"}
                                    />
                                )
                            }}
                            placeholder={"密码: ant.design"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入密码！"
                                }
                            ]}
                        />
                    </>
                )}
                {loginType === "phone" && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: "large",
                                prefix: (
                                    <MobileOutlined
                                        style={{
                                            color: token.colorText
                                        }}
                                        className={"prefixIcon"}
                                    />
                                )
                            }}
                            name="mobile"
                            placeholder={"手机号"}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入手机号！"
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: "手机号格式错误！"
                                }
                            ]}
                        />
                        <ProFormCaptcha
                            fieldProps={{
                                size: "large",
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText
                                        }}
                                        className={"prefixIcon"}
                                    />
                                )
                            }}
                            captchaProps={{
                                size: "large"
                            }}
                            placeholder={"请输入验证码"}
                            captchaTextRender={(timing, count) => {
                                if (timing) {
                                    return `${count} ${"获取验证码"}`
                                }
                                return "获取验证码"
                            }}
                            name="captcha"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入验证码！"
                                }
                            ]}
                            onGetCaptcha={async () => {
                                message.success("获取验证码成功！验证码为：1234")
                            }}
                        />
                    </>
                )}
                <div
                    style={{
                        marginBlockEnd: 24
                    }}
                >
                    <ProFormCheckbox noStyle name="autoLogin">
                        自动登录
                    </ProFormCheckbox>
                    <a
                        style={{
                            float: "right"
                        }}
                    >
                        忘记密码
                    </a>
                </div>
            </LoginFormPage>
        </div>
    )
})