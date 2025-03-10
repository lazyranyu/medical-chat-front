// 定义加载状态类型
export let DatabaseLoadingState

;(function(DatabaseLoadingState) {
    DatabaseLoadingState["Error"] = "error"
    DatabaseLoadingState["Finished"] = "finished"
    DatabaseLoadingState["Idle"] = "idle"
    DatabaseLoadingState["Initializing"] = "initializing"
    DatabaseLoadingState["LoadingDependencies"] = "loadingDependencies"
    DatabaseLoadingState["LoadingWasm"] = "loadingWasm"
    DatabaseLoadingState["Migrating"] = "migrating"
    DatabaseLoadingState["Ready"] = "ready"
})(DatabaseLoadingState || (DatabaseLoadingState = {}))

export const ClientDatabaseInitStages = [
    DatabaseLoadingState.Idle,
    DatabaseLoadingState.Initializing,
    DatabaseLoadingState.LoadingDependencies,
    DatabaseLoadingState.LoadingWasm,
    DatabaseLoadingState.Migrating,
    DatabaseLoadingState.Finished
]
