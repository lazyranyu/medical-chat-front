
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { initialState } from './initialState';
import {  createAuthSlice } from './slices/auth/action';
// import {  createCommonSlice } from './slices/common/action';
// import {  createModelListSlice } from './slices/modelList/action';
import {  createPreferenceSlice } from './slices/preference/action';
import {  createSettingsSlice } from './slices/settings/action';
// import {  createSyncSlice } from './slices/sync/action';

//  ===============  聚合 createStoreFn ============ //
const createStore = (...parameters) => ({
  ...initialState,
  // ...createSyncSlice(...parameters),
  ...createSettingsSlice(...parameters),
  ...createPreferenceSlice(...parameters),
  ...createAuthSlice(...parameters),
  // ...createCommonSlice(...parameters),
  // ...createModelListSlice(...parameters)
})

//  ===============  实装 useStore ============ //

const devtools = createDevtools("user")

export const useUserStore = createWithEqualityFn()(
    subscribeWithSelector(devtools(createStore)),
    shallow
)

