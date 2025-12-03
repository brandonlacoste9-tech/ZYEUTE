from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class PullTaskRequest(_message.Message):
    __slots__ = ()
    BEE_ID_FIELD_NUMBER: _ClassVar[int]
    ROLE_FIELD_NUMBER: _ClassVar[int]
    CAPABILITIES_FIELD_NUMBER: _ClassVar[int]
    bee_id: str
    role: str
    capabilities: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, bee_id: _Optional[str] = ..., role: _Optional[str] = ..., capabilities: _Optional[_Iterable[str]] = ...) -> None: ...

class PullTaskResponse(_message.Message):
    __slots__ = ()
    TASK_FIELD_NUMBER: _ClassVar[int]
    LEASE_ID_FIELD_NUMBER: _ClassVar[int]
    LEASE_EXPIRES_AT_FIELD_NUMBER: _ClassVar[int]
    task: Task
    lease_id: str
    lease_expires_at: int
    def __init__(self, task: _Optional[_Union[Task, _Mapping]] = ..., lease_id: _Optional[str] = ..., lease_expires_at: _Optional[int] = ...) -> None: ...

class Task(_message.Message):
    __slots__ = ()
    ID_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    PAYLOAD_JSON_FIELD_NUMBER: _ClassVar[int]
    PRIORITY_FIELD_NUMBER: _ClassVar[int]
    SEMANTIC_CATEGORY_FIELD_NUMBER: _ClassVar[int]
    SEMANTIC_LABELS_FIELD_NUMBER: _ClassVar[int]
    ATTEMPTS_FIELD_NUMBER: _ClassVar[int]
    id: str
    type: str
    payload_json: str
    priority: str
    semantic_category: str
    semantic_labels: _containers.RepeatedScalarFieldContainer[str]
    attempts: int
    def __init__(self, id: _Optional[str] = ..., type: _Optional[str] = ..., payload_json: _Optional[str] = ..., priority: _Optional[str] = ..., semantic_category: _Optional[str] = ..., semantic_labels: _Optional[_Iterable[str]] = ..., attempts: _Optional[int] = ...) -> None: ...

class ReportResultRequest(_message.Message):
    __slots__ = ()
    TASK_ID_FIELD_NUMBER: _ClassVar[int]
    LEASE_ID_FIELD_NUMBER: _ClassVar[int]
    RESULT_JSON_FIELD_NUMBER: _ClassVar[int]
    EXECUTION_TIME_MS_FIELD_NUMBER: _ClassVar[int]
    task_id: str
    lease_id: str
    result_json: str
    execution_time_ms: float
    def __init__(self, task_id: _Optional[str] = ..., lease_id: _Optional[str] = ..., result_json: _Optional[str] = ..., execution_time_ms: _Optional[float] = ...) -> None: ...

class ReportResultResponse(_message.Message):
    __slots__ = ()
    ACKNOWLEDGED_FIELD_NUMBER: _ClassVar[int]
    NEXT_TASK_ID_FIELD_NUMBER: _ClassVar[int]
    acknowledged: bool
    next_task_id: str
    def __init__(self, acknowledged: _Optional[bool] = ..., next_task_id: _Optional[str] = ...) -> None: ...

class ReportFailureRequest(_message.Message):
    __slots__ = ()
    TASK_ID_FIELD_NUMBER: _ClassVar[int]
    LEASE_ID_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    ERROR_TRACE_FIELD_NUMBER: _ClassVar[int]
    RETRYABLE_FIELD_NUMBER: _ClassVar[int]
    task_id: str
    lease_id: str
    error: str
    error_trace: str
    retryable: bool
    def __init__(self, task_id: _Optional[str] = ..., lease_id: _Optional[str] = ..., error: _Optional[str] = ..., error_trace: _Optional[str] = ..., retryable: _Optional[bool] = ...) -> None: ...

class ReportFailureResponse(_message.Message):
    __slots__ = ()
    ACKNOWLEDGED_FIELD_NUMBER: _ClassVar[int]
    WILL_RETRY_FIELD_NUMBER: _ClassVar[int]
    RETRY_COUNT_FIELD_NUMBER: _ClassVar[int]
    acknowledged: bool
    will_retry: bool
    retry_count: int
    def __init__(self, acknowledged: _Optional[bool] = ..., will_retry: _Optional[bool] = ..., retry_count: _Optional[int] = ...) -> None: ...

class HeartbeatRequest(_message.Message):
    __slots__ = ()
    BEE_ID_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    CURRENT_TASK_ID_FIELD_NUMBER: _ClassVar[int]
    METRICS_FIELD_NUMBER: _ClassVar[int]
    bee_id: str
    status: str
    current_task_id: str
    metrics: WorkerMetrics
    def __init__(self, bee_id: _Optional[str] = ..., status: _Optional[str] = ..., current_task_id: _Optional[str] = ..., metrics: _Optional[_Union[WorkerMetrics, _Mapping]] = ...) -> None: ...

class WorkerMetrics(_message.Message):
    __slots__ = ()
    CPU_USAGE_FIELD_NUMBER: _ClassVar[int]
    MEMORY_USAGE_FIELD_NUMBER: _ClassVar[int]
    TASKS_COMPLETED_FIELD_NUMBER: _ClassVar[int]
    TASKS_FAILED_FIELD_NUMBER: _ClassVar[int]
    cpu_usage: float
    memory_usage: float
    tasks_completed: int
    tasks_failed: int
    def __init__(self, cpu_usage: _Optional[float] = ..., memory_usage: _Optional[float] = ..., tasks_completed: _Optional[int] = ..., tasks_failed: _Optional[int] = ...) -> None: ...

class HeartbeatResponse(_message.Message):
    __slots__ = ()
    ACKNOWLEDGED_FIELD_NUMBER: _ClassVar[int]
    COMMAND_FIELD_NUMBER: _ClassVar[int]
    acknowledged: bool
    command: str
    def __init__(self, acknowledged: _Optional[bool] = ..., command: _Optional[str] = ...) -> None: ...

class RegisterWorkerRequest(_message.Message):
    __slots__ = ()
    class ConfigEntry(_message.Message):
        __slots__ = ()
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    BEE_ID_FIELD_NUMBER: _ClassVar[int]
    ROLE_FIELD_NUMBER: _ClassVar[int]
    SKILLS_FIELD_NUMBER: _ClassVar[int]
    CONFIG_FIELD_NUMBER: _ClassVar[int]
    bee_id: str
    role: str
    skills: _containers.RepeatedScalarFieldContainer[str]
    config: _containers.ScalarMap[str, str]
    def __init__(self, bee_id: _Optional[str] = ..., role: _Optional[str] = ..., skills: _Optional[_Iterable[str]] = ..., config: _Optional[_Mapping[str, str]] = ...) -> None: ...

class RegisterWorkerResponse(_message.Message):
    __slots__ = ()
    REGISTERED_FIELD_NUMBER: _ClassVar[int]
    WORKER_ID_FIELD_NUMBER: _ClassVar[int]
    registered: bool
    worker_id: str
    def __init__(self, registered: _Optional[bool] = ..., worker_id: _Optional[str] = ...) -> None: ...
