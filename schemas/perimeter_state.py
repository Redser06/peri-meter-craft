"""State schemas mirrored from src/types/perimeter.ts. Stdlib only."""

from dataclasses import asdict, dataclass, field


@dataclass
class CurriculumModule:
    id: str
    trackId: str
    title: str
    order: int
    prerequisites: list = field(default_factory=list)


@dataclass
class LearnerProgressState:
    learnerId: str
    moduleId: str
    status: str
    mastery: float
    updatedAt: str


@dataclass
class ManagerROIState:
    managerId: str
    period: str
    prs: int
    prototypes: int
    hoursPerPr: float
    hoursPerPrototype: float
    usdPerHour: float
    hoursSaved: float
    usdSaved: float


MODULE_STATUSES = ("not_started", "in_progress", "complete")


def round_trip(instance):
    data = asdict(instance)
    return type(instance)(**data), data
