---
date: 2026-10-24
topic: billing
# The SQL below is illustrative. Publish once it matches the real trigger.
draft: true
---

One rule for the billing ledger: you never edit money. A correction is a new row, and the database itself refuses anything else.

```sql
CREATE TRIGGER ledger_append_only
  BEFORE UPDATE OR DELETE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION reject_ledger_change();
```
