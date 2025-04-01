import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

import { createDevtools } from "../middleware/createDevtools"
import { initialState } from "./initialState"
import { createFileSlice } from "./slices/chat"
// import { createFileChunkSlice } from "./slices/chunk"
// import { createFileManageSlice } from "./slices/fileManager"
// import { createTTSFileSlice } from "./slices/tts"
import { createFileUploadSlice } from "./slices/upload/action"

const createStore = (...parameters) => ({
  ...initialState,
  ...createFileSlice(...parameters),
  // ...createFileManageSlice(...parameters),
  // ...createTTSFileSlice(...parameters),
  // ...createFileChunkSlice(...parameters),
  ...createFileUploadSlice(...parameters)
})

//  ===============  实装 useStore ============ //
const devtools = createDevtools("file")

export const useFileStore = createWithEqualityFn()(
    devtools(createStore),
    shallow
)
