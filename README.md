This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.jsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 聊天消息性能优化说明

为了解决临时消息更新为真实消息时出现的性能问题，我们进行了以下优化：

## 1. 优化消息内容更新逻辑 (`internal_updateMessageContent`)

- 使用防抖机制减少频繁刷新消息列表
- 引入延时刷新策略，将多次更新合并为一次
- 确保数据库操作不阻塞UI更新

## 2. 优化消息流处理 (`onMessageHandle`)

- 添加消息更新频率控制，避免每个文本块都触发状态更新
- 基于时间和内容长度的双重条件控制更新频率
- 使用`immediate: true`标记确保重要更新能立即反映到UI

## 3. 优化消息流结束处理 (`onFinish`)

- 根据最终内容是否与当前状态一致采取不同策略
- 将数据库操作异步化，避免阻塞UI线程
- 使用延时刷新策略确保最终状态一致性

## 4. 新增状态管理

在`initialState.js`中添加了两个新的状态：
- `refreshMessageScheduled`: 控制消息刷新调度
- `lastTextUpdateTime`: 跟踪最后文本更新时间

## 性能提升

这些优化主要通过以下方式提高性能：

1. **减少渲染次数**：通过控制状态更新频率，减少React组件重渲染次数
2. **异步化数据库操作**：确保数据库操作不阻塞UI响应
3. **批量处理更新**：将多次小更新合并为少数几次大更新
4. **智能防抖**：在保持用户体验流畅的同时减少不必要的更新

## 注意事项

- 这些优化侧重于改善消息更新性能，不影响功能逻辑
- 对于非常长的消息，可能需要进一步调整更新频率参数
- 建议在生产环境中监控这些更改的效果，根据需要微调参数
