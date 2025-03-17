import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import { createDevtools } from "../middleware/createDevtools"
import { initialState } from "./initialState"
import { createChatSlice } from "./slices/chat/action"

const createStore = (...parameters) => ({
  ...initialState,
  ...createChatSlice(...parameters)
})

//  ===============  implement useStore ============ //

const devtools = createDevtools("agent")

export const useAgentStore = createWithEqualityFn()(
    devtools(createStore),
    shallow
)
