'use client';
import { Modal } from 'antd';
import { ProConfigProvider } from '@ant-design/pro-components';
import {RegisterForm} from './RegisterFrom'; // 我们将原始页面内容提取到这里

export const RegisterModal = ({ open, onClose }) => {
    return (
        <ProConfigProvider >
            <Modal
                open={open}
                onCancel={onClose}
                footer={null}
                width={900}
                height={580}
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
                    <RegisterForm />
                </div>
            </Modal>
        </ProConfigProvider>
    );
};
