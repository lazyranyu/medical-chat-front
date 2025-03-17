import { subscribeWithSelector } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import { isDev } from "@/utils/env"

import { createDevtools } from "../middleware/createDevtools"
import { initialState } from "./initialState"
import { createSessionSlice } from "./slices/session/action"
import { createSessionGroupSlice } from "./slices/sessionGroup/action"

const createStore = (...parameters) => ({
    ...initialState,
    ...createSessionSlice(...parameters),
    ...createSessionGroupSlice(...parameters)
})

//  ===============  implement useStore ============ //
const devtools = createDevtools("session")

export const useSessionStore = createWithEqualityFn()(
    subscribeWithSelector(
        devtools(createStore, {
            name: "LobeChat_Session" + (isDev ? "_DEV" : "")
        })
    ),
    shallow
)
