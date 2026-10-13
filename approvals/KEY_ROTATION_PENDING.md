# Key rotation is pending

Conor rotates the publishable key in the project dashboard and then records approval `PERI-SUPABASE-KEY-ROTATION`.

Agents do not open the dashboard and do not handle the new key. Until that approval file exists, `perimeter_key_rotation_recorded` stays pending.

Expected record, written by Conor after rotation:

```json
{
  "ref": "PERI-SUPABASE-KEY-ROTATION",
  "status": "approved",
  "approver": "conor"
}
```

Save it as `approvals/PERI-SUPABASE-KEY-ROTATION.json`. Do not paste key material into that file.
