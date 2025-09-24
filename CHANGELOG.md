
# Changelog — collection & normalization session

Date: 2025-09-23

Summary of changes made in this session:

- Integrations & normalization
  - Added/updated normalizers for Adzuna, JSearch (RapidAPI), and RemoteOK.
  - `tags` are now normalized as Python lists (or NULL) to be compatible with Postgres `text[]`.

- Persistence & robustness
  - `save_jobs_to_db` made more resilient: per-record commit, rollback on failure, and better error logging.
  - `Job.tags` explicitly mapped to `ARRAY(Text)` to align with the existing Postgres schema.

- Collection
  - Performed a short, safe collection run (1 page per query, 1.5s sleep between requests, max 20 Adzuna calls) and saved results to the primary DB.
  - DB snapshot after the run: ~1396 jobs saved. See `app/scripts/db_report.py` for details.

Notes & next steps

- Changes were intentionally minimal and non-invasive to the DB schema.
- Recommend reviewing application and DB logs in production before running larger collections.
- Next: continue collection in controlled batches or add filtering to reduce noise.

Author: changes applied during the session on the user's machine.
