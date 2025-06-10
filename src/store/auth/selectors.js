// store/user/selectors.js

export const selectUserId = (state) => state.userId;
export const selectUsername = (state) => state.username;
export const selectAvatarUrl = (state) => state.avatarUrl;
export const selectIsLogin = (state) => state.isLogin;
export const selectIsLoading = (state) => state.isLoading;
export const selectError = (state) => state.error;
