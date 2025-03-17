import { z } from "zod"

export let ThreadType

;(function(ThreadType) {
  ThreadType["Continuation"] = "continuation"
  ThreadType["Standalone"] = "standalone"
})(ThreadType || (ThreadType = {}))

export let ThreadStatus

;(function(ThreadStatus) {
  ThreadStatus["Active"] = "active"
  ThreadStatus["Archived"] = "archived"
  ThreadStatus["Deprecated"] = "deprecated"
})(ThreadStatus || (ThreadStatus = {}))

export const createThreadSchema = z.object({
  parentThreadId: z.string().optional(),
  sourceMessageId: z.string(),
  title: z.string().optional(),
  topicId: z.string(),
  type: z.nativeEnum(ThreadType)
})
