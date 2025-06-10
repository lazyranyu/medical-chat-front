// store/user/index.js

import { create } from 'zustand';
import { initialState } from './initialState';
import { createUserActions } from './action';

const useAuthStore = create((set, get) => ({
    ...initialState,
    ...createUserActions(set, get),
}));

export default useAuthStore;
