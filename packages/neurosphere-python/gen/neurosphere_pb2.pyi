from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class EmbedRequest(_message.Message):
    __slots__ = ()
    INPUT_FIELD_NUMBER: _ClassVar[int]
    MODEL_FIELD_NUMBER: _ClassVar[int]
    input: str
    model: str
    def __init__(self, input: _Optional[str] = ..., model: _Optional[str] = ...) -> None: ...

class EmbedResponse(_message.Message):
    __slots__ = ()
    EMBEDDING_FIELD_NUMBER: _ClassVar[int]
    CONFIDENCE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    embedding: _containers.RepeatedScalarFieldContainer[float]
    confidence: float
    metadata: EmbedMetadata
    def __init__(self, embedding: _Optional[_Iterable[float]] = ..., confidence: _Optional[float] = ..., metadata: _Optional[_Union[EmbedMetadata, _Mapping]] = ...) -> None: ...

class EmbedMetadata(_message.Message):
    __slots__ = ()
    MODEL_FIELD_NUMBER: _ClassVar[int]
    DIM_FIELD_NUMBER: _ClassVar[int]
    ON_UNIT_SPHERE_FIELD_NUMBER: _ClassVar[int]
    NORM_FIELD_NUMBER: _ClassVar[int]
    model: str
    dim: int
    on_unit_sphere: bool
    norm: float
    def __init__(self, model: _Optional[str] = ..., dim: _Optional[int] = ..., on_unit_sphere: _Optional[bool] = ..., norm: _Optional[float] = ...) -> None: ...

class ClassifyRequest(_message.Message):
    __slots__ = ()
    INPUT_FIELD_NUMBER: _ClassVar[int]
    CATEGORIES_FIELD_NUMBER: _ClassVar[int]
    input: str
    categories: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, input: _Optional[str] = ..., categories: _Optional[_Iterable[str]] = ...) -> None: ...

class ClassifyResponse(_message.Message):
    __slots__ = ()
    LABELS_FIELD_NUMBER: _ClassVar[int]
    CATEGORY_FIELD_NUMBER: _ClassVar[int]
    CONFIDENCE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    labels: _containers.RepeatedScalarFieldContainer[str]
    category: str
    confidence: float
    metadata: ClassifyMetadata
    def __init__(self, labels: _Optional[_Iterable[str]] = ..., category: _Optional[str] = ..., confidence: _Optional[float] = ..., metadata: _Optional[_Union[ClassifyMetadata, _Mapping]] = ...) -> None: ...

class ClassifyMetadata(_message.Message):
    __slots__ = ()
    CONCEPTS_EXTRACTED_FIELD_NUMBER: _ClassVar[int]
    ALL_CONCEPTS_FIELD_NUMBER: _ClassVar[int]
    concepts_extracted: int
    all_concepts: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, concepts_extracted: _Optional[int] = ..., all_concepts: _Optional[_Iterable[str]] = ...) -> None: ...

class ReasonRequest(_message.Message):
    __slots__ = ()
    class ContextEntry(_message.Message):
        __slots__ = ()
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    QUERY_FIELD_NUMBER: _ClassVar[int]
    CONTEXT_FIELD_NUMBER: _ClassVar[int]
    MAX_HOPS_FIELD_NUMBER: _ClassVar[int]
    INCLUDE_VISUAL_FIELD_NUMBER: _ClassVar[int]
    query: str
    context: _containers.ScalarMap[str, str]
    max_hops: int
    include_visual: bool
    def __init__(self, query: _Optional[str] = ..., context: _Optional[_Mapping[str, str]] = ..., max_hops: _Optional[int] = ..., include_visual: _Optional[bool] = ...) -> None: ...

class ReasonResponse(_message.Message):
    __slots__ = ()
    REASONING_FIELD_NUMBER: _ClassVar[int]
    NEXT_ACTION_FIELD_NUMBER: _ClassVar[int]
    CONFIDENCE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    reasoning: str
    next_action: str
    confidence: float
    metadata: ReasonMetadata
    def __init__(self, reasoning: _Optional[str] = ..., next_action: _Optional[str] = ..., confidence: _Optional[float] = ..., metadata: _Optional[_Union[ReasonMetadata, _Mapping]] = ...) -> None: ...

class ReasonMetadata(_message.Message):
    __slots__ = ()
    CONVERGENCE_CYCLE_FIELD_NUMBER: _ClassVar[int]
    FINAL_ENERGY_FIELD_NUMBER: _ClassVar[int]
    PAIRWISE_UPLIFT_FIELD_NUMBER: _ClassVar[int]
    CLUSTERING_FIELD_NUMBER: _ClassVar[int]
    GRAPH_NODES_FIELD_NUMBER: _ClassVar[int]
    GRAPH_EDGES_FIELD_NUMBER: _ClassVar[int]
    REASONING_PATH_FIELD_NUMBER: _ClassVar[int]
    convergence_cycle: int
    final_energy: float
    pairwise_uplift: float
    clustering: float
    graph_nodes: int
    graph_edges: int
    reasoning_path: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, convergence_cycle: _Optional[int] = ..., final_energy: _Optional[float] = ..., pairwise_uplift: _Optional[float] = ..., clustering: _Optional[float] = ..., graph_nodes: _Optional[int] = ..., graph_edges: _Optional[int] = ..., reasoning_path: _Optional[_Iterable[str]] = ...) -> None: ...

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
    METRICS_FIELD_NUMBER: _ClassVar[int]
    status: str
    version: str
    uptime_seconds: int
    metrics: _containers.ScalarMap[str, str]
    def __init__(self, status: _Optional[str] = ..., version: _Optional[str] = ..., uptime_seconds: _Optional[int] = ..., metrics: _Optional[_Mapping[str, str]] = ...) -> None: ...
