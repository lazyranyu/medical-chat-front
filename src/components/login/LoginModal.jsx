'use client';
import { Modal } from 'antd';
import { ProConfigProvider } from '@ant-design/pro-components';
import {LoginForm} from './LoginForm'; // 我们将原始页面内容提取到这里

export const LoginModal = ({ open, onClose }) => {
    return (
        <ProConfigProvider dark>
            <Modal
                open={open}
                onCancel={onClose}
                footer={null}
                width={900}
                destroyOnClose
                mask={false}
                styles={{
                    content: {
                        padding: 0,
                        borderRadius: 20
                    }
                }}
            >
                <div >
                    <LoginForm />
                </div>
            </Modal>
        </ProConfigProvider>
    );
};
