from dataclasses import asdict, dataclass
import json
from typing import Any, List


@dataclass
class CurriculumModule:
    id: str
    title: str
    track: str
    prerequisites: List[str]
    eval_gate_id: str
    deliverable_type: str
    rubric_property_checks: List[str]


@dataclass
class LearnerProgressState:
    learner_id: str
    completed_module_ids: List[str]
    prs_authored_count: int
    prototypes_deployed_count: int
    project_catalogue: List[Any]


@dataclass
class ManagerROIState:
    team_id: str
    enrolled_pm_count: int
    certified_ai_pm_count: int
    aggregate_prs_shipped: int
    engineering_hours_offset_monthly: float
    estimated_dollar_roi_monthly: float


def round_trip(instance: Any) -> tuple[Any, dict]:
    data = asdict(instance)
    encoded = json.dumps(data)
    decoded = json.loads(encoded)
    cls = type(instance)
    return cls(**decoded), data
