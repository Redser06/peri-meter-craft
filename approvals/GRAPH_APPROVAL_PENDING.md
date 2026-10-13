# Graph approval is pending Conor's countersignature

This branch does not contain `approvals/PERI-PHASE1-GRAPH-V2.json`.

An earlier draft recorded that file with approver `phase-1-task` and `signed_by_conor` set to false. That record was not Conor's approval. It has been removed. This change does not replace it with another agent signature.

`perimeter_approval_recorded` stays pending until Conor writes the file himself. While the file is absent the gate does not pass, and the suite does not treat that pending human step as an agent failure. A file that is present and is not his countersignature fails the gate.

The open decision `protected_files_list` stays open until that same countersignature. Agents do not close it.

Expected record, written by Conor:

```json
{
  "ref": "PERI-PHASE1-GRAPH-V2",
  "status": "approved",
  "approver": "conor",
  "signed_by_conor": true,
  "graph_sha": "6a6d3991260466205210913a6bad1ab3b6e3df60612b52a96ff48f4c6fcd4c6f"
}
```

`graph_sha` is the sha256 of `projects/perimeter/perimeter-phase1.graph-v2.yaml`. Save the record as `approvals/PERI-PHASE1-GRAPH-V2.json`.
