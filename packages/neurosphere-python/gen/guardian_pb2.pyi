from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class GuardStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    GUARD_STATUS_UNSPECIFIED: _ClassVar[GuardStatus]
    OK: _ClassVar[GuardStatus]
    BLOCKED: _ClassVar[GuardStatus]
    ROLLBACK: _ClassVar[GuardStatus]
GUARD_STATUS_UNSPECIFIED: GuardStatus
OK: GuardStatus
BLOCKED: GuardStatus
ROLLBACK: GuardStatus

class GuardRequest(_message.Message):
    __slots__ = ()
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    INPUT_JSON_FIELD_NUMBER: _ClassVar[int]
    CONTEXT_JSON_FIELD_NUMBER: _ClassVar[int]
    source: str
    input_json: str
    context_json: str
    def __init__(self, source: _Optional[str] = ..., input_json: _Optional[str] = ..., context_json: _Optional[str] = ...) -> None: ...

class GuardResponse(_message.Message):
    __slots__ = ()
    STATUS_FIELD_NUMBER: _ClassVar[int]
    SAFE_OUTPUT_JSON_FIELD_NUMBER: _ClassVar[int]
    CONFIDENCE_FIELD_NUMBER: _ClassVar[int]
    VIOLATIONS_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    status: GuardStatus
    safe_output_json: str
    confidence: float
    violations: _containers.RepeatedScalarFieldContainer[str]
    metadata: GuardMetadata
    def __init__(self, status: _Optional[_Union[GuardStatus, str]] = ..., safe_output_json: _Optional[str] = ..., confidence: _Optional[float] = ..., violations: _Optional[_Iterable[str]] = ..., metadata: _Optional[_Union[GuardMetadata, _Mapping]] = ...) -> None: ...

class GuardMetadata(_message.Message):
    __slots__ = ()
    PATTERNS_MATCHED_FIELD_NUMBER: _ClassVar[int]
    DRIFT_SCORE_FIELD_NUMBER: _ClassVar[int]
    CONSENSUS_REQUIRED_FIELD_NUMBER: _ClassVar[int]
    patterns_matched: _containers.RepeatedScalarFieldContainer[str]
    drift_score: float
    consensus_required: bool
    def __init__(self, patterns_matched: _Optional[_Iterable[str]] = ..., drift_score: _Optional[float] = ..., consensus_required: _Optional[bool] = ...) -> None: ...

class VoteRequest(_message.Message):
    __slots__ = ()
    CANDIDATES_JSON_FIELD_NUMBER: _ClassVar[int]
    THRESHOLD_FIELD_NUMBER: _ClassVar[int]
    candidates_json: _containers.RepeatedScalarFieldContainer[str]
    threshold: float
    def __init__(self, candidates_json: _Optional[_Iterable[str]] = ..., threshold: _Optional[float] = ...) -> None: ...

class VoteResponse(_message.Message):
    __slots__ = ()
    CONSENSUS_JSON_FIELD_NUMBER: _ClassVar[int]
    AGREEMENT_FIELD_NUMBER: _ClassVar[int]
    VOTES_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    consensus_json: str
    agreement: float
    votes: _containers.RepeatedCompositeFieldContainer[VoteResult]
    metadata: VoteMetadata
    def __init__(self, consensus_json: _Optional[str] = ..., agreement: _Optional[float] = ..., votes: _Optional[_Iterable[_Union[VoteResult, _Mapping]]] = ..., metadata: _Optional[_Union[VoteMetadata, _Mapping]] = ...) -> None: ...

class VoteResult(_message.Message):
    __slots__ = ()
    CANDIDATE_JSON_FIELD_NUMBER: _ClassVar[int]
    VOTE_COUNT_FIELD_NUMBER: _ClassVar[int]
    CONFIDENCE_FIELD_NUMBER: _ClassVar[int]
    candidate_json: str
    vote_count: int
    confidence: float
    def __init__(self, candidate_json: _Optional[str] = ..., vote_count: _Optional[int] = ..., confidence: _Optional[float] = ...) -> None: ...

class VoteMetadata(_message.Message):
    __slots__ = ()
    TOTAL_CANDIDATES_FIELD_NUMBER: _ClassVar[int]
    VOTING_AGENTS_FIELD_NUMBER: _ClassVar[int]
    CONSENSUS_METHOD_FIELD_NUMBER: _ClassVar[int]
    total_candidates: int
    voting_agents: int
    consensus_method: str
    def __init__(self, total_candidates: _Optional[int] = ..., voting_agents: _Optional[int] = ..., consensus_method: _Optional[str] = ...) -> None: ...

class DriftRequest(_message.Message):
    __slots__ = ()
    SCOPE_FIELD_NUMBER: _ClassVar[int]
    INPUT_JSON_FIELD_NUMBER: _ClassVar[int]
    BASELINE_HASH_FIELD_NUMBER: _ClassVar[int]
    scope: str
    input_json: str
    baseline_hash: str
    def __init__(self, scope: _Optional[str] = ..., input_json: _Optional[str] = ..., baseline_hash: _Optional[str] = ...) -> None: ...

class DriftResponse(_message.Message):
    __slots__ = ()
    KL_DIVERGENCE_FIELD_NUMBER: _ClassVar[int]
    ALERT_FIELD_NUMBER: _ClassVar[int]
    CURRENT_HASH_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    kl_divergence: float
    alert: bool
    current_hash: str
    metadata: DriftMetadata
    def __init__(self, kl_divergence: _Optional[float] = ..., alert: _Optional[bool] = ..., current_hash: _Optional[str] = ..., metadata: _Optional[_Union[DriftMetadata, _Mapping]] = ...) -> None: ...

class DriftMetadata(_message.Message):
    __slots__ = ()
    THRESHOLD_FIELD_NUMBER: _ClassVar[int]
    LAST_STABLE_HASH_FIELD_NUMBER: _ClassVar[int]
    SAMPLES_SINCE_BASELINE_FIELD_NUMBER: _ClassVar[int]
    threshold: float
    last_stable_hash: str
    samples_since_baseline: int
    def __init__(self, threshold: _Optional[float] = ..., last_stable_hash: _Optional[str] = ..., samples_since_baseline: _Optional[int] = ...) -> None: ...

class HealthRequest(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class HealthResponse(_message.Message):
    __slots__ = ()
    class MetricsEntry(_message.Message):
        __slots__ = ()
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    STATUS_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    UPTIME_SECONDS_FIELD_NUMBER: _ClassVar[int]
    UPTIME_PERCENT_FIELD_NUMBER: _ClassVar[int]
    BLACKOUT_SURVIVAL_FIELD_NUMBER: _ClassVar[int]
    FAULTY_AGENTS_FIELD_NUMBER: _ClassVar[int]
    CONSENSUS_RATE_FIELD_NUMBER: _ClassVar[int]
    METRICS_FIELD_NUMBER: _ClassVar[int]
    status: str
    version: str
    uptime_seconds: int
    uptime_percent: float
    blackout_survival: bool
    faulty_agents: int
    consensus_rate: float
    metrics: _containers.ScalarMap[str, str]
    def __init__(self, status: _Optional[str] = ..., version: _Optional[str] = ..., uptime_seconds: _Optional[int] = ..., uptime_percent: _Optional[float] = ..., blackout_survival: _Optional[bool] = ..., faulty_agents: _Optional[int] = ..., consensus_rate: _Optional[float] = ..., metrics: _Optional[_Mapping[str, str]] = ...) -> None: ...
