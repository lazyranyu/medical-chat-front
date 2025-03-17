import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import {generalActionSlice } from './actions/general';
import {globalWorkspaceSlice } from './actions/workspacePane';
import { initialState } from './initialState';

const createStore = (...parameters) => ({
    ...initialState,
    ...globalWorkspaceSlice(...parameters),
    ...generalActionSlice(...parameters)
})

//  ===============  实装 useStore ============ //

const devtools = createDevtools("global")

export const useGlobalStore = createWithEqualityFn()(
    subscribeWithSelector(devtools(createStore)),
    shallow
)
