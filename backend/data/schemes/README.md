# Scheme evidence documents

Add verified government scheme documents here as `.pdf`, `.txt`, `.md`, or `.json`.
The retriever reads these local files at request time. For best traceability, use JSON
records with `text`, `source_title`, `source_url`, `department`, `publication_date`,
and `validity_status` fields. Do not mark a source verified unless you have checked it.

Example JSON file:

```json
[
  {
    "scheme_title": "Example scheme title",
    "text": "Evidence copied accurately from the official source.",
    "source_title": "Official department page",
    "source_url": "https://example.gov.in/replace-with-real-source",
    "publisher": "Department name",
    "department": "Department name",
    "publication_date": "",
    "validity_status": "unverified"
  }
]
```

The example URL and text are placeholders, not actual scheme information. Replace them
with checked official content before testing real answers.
