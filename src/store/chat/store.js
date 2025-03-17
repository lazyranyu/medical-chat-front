// sort-imports-ignore
import { subscribeWithSelector } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import { createDevtools } from "../middleware/createDevtools"
import { initialState } from "./initialState"

import {createMessageSlice} from "./slices/message/action"

import { chatTopic } from "./slices/topic/action"
import { chatThreadMessage } from "./slices/thread/action"
import { chatAiChat } from "@/store/chat/slices/aiChat/actions";

//  ===============  聚合 createStoreFn ============ //

const createStore = (...params) => ({
  ...initialState,
  ...chatAiChat(...params),
  ...createMessageSlice(...params),
  ...chatThreadMessage(...params),
  ...chatTopic(...params),

  // cloud
})

//  ===============  实装 useStore ============ //
const devtools = createDevtools("chat")

export const useChatStore = createWithEqualityFn()(
    subscribeWithSelector(devtools(createStore)),
    shallow
)
