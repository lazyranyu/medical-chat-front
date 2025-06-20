import "./globals.css";
import { App as AntdApp } from 'antd';
// 抑制antd的警告 - 只在客户端执行
if (typeof window !== 'undefined') {
  // 重写console.warn来过滤掉特定的警告
  const originalWarn = console.warn;
  console.warn = function(...args) {
    // 过滤掉antd的Tooltip和其他废弃属性警告
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('[antd: Tooltip] `overlayClassName` is deprecated') || 
         args[0].includes('[antd: Tooltip] `overlayStyle` is deprecated'))) {
      return;
    }
    originalWarn.apply(console, args);
  };

  // 重写console.error来过滤掉antd的React兼容性警告
  const originalError = console.error;
  console.error = function(...args) {
    // 过滤掉antd的React兼容性警告
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('[antd: compatible] antd v5 support React is 16 ~ 18') ||
         args[0].includes('Warning: [antd: compatible]'))) {
      return;
    }
    originalError.apply(console, args);
  };
}

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };
import StyleRegistry from "@/layout/StyleRegistry";
import AppTheme from "@/layout/AppTheme";
import RouteGuard from "@/components/RouteGuard";
import AntdReact19Compat from '@/components/AntdReact19Compat';

// 添加兼容性组件
// import AntdReact19Compat from "@/components/AntdReact19Compat";

export const generateViewport = async () => {
  return {
    initialScale: 1,
    minimumScale: 1,
    themeColor: [
      { color: "#f8f8f8", media: "(prefers-color-scheme: light)" },
      { color: "#000", media: "(prefers-color-scheme: dark)" }
    ],
    viewportFit: "cover",
  }
}

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body suppressHydrationWarning>
      <AntdReact19Compat />
      <StyleRegistry>
          <AppTheme>
              <RouteGuard>
              {children}
              </RouteGuard>
          </AppTheme>
      </StyleRegistry>

      </body>
      </html>
  );
}
export { generateMetadata } from "./metadata"
   