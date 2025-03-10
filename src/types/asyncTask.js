export let AsyncTaskType

;(function(AsyncTaskType) {
  AsyncTaskType["Chunking"] = "chunk"
  AsyncTaskType["Embedding"] = "embedding"
})(AsyncTaskType || (AsyncTaskType = {}))

export let AsyncTaskStatus

;(function(AsyncTaskStatus) {
  AsyncTaskStatus["Error"] = "error"
  AsyncTaskStatus["Pending"] = "pending"
  AsyncTaskStatus["Processing"] = "processing"
  AsyncTaskStatus["Success"] = "success"
})(AsyncTaskStatus || (AsyncTaskStatus = {}))

export let AsyncTaskErrorType

;(function(AsyncTaskErrorType) {
  AsyncTaskErrorType["EmbeddingError"] = "EmbeddingError"
  AsyncTaskErrorType["NoChunkError"] = "NoChunkError"
  AsyncTaskErrorType["ServerError"] = "ServerError"
  AsyncTaskErrorType["TaskTriggerError"] = "TaskTriggerError"
  AsyncTaskErrorType["Timeout"] = "TaskTimeout"
})(AsyncTaskErrorType || (AsyncTaskErrorType = {}))

export class AsyncTaskError {
  constructor(name, message) {
    this.name = name
    this.body = { detail: message }
  }
}
