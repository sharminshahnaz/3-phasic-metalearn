---
name: Embedded resource previews
description: Why the research platform uses a local document preview instead of the uploaded external PDF placeholder.
---

Use an in-app document preview when a supplied PDF URL is only a placeholder or sends restrictive iframe headers.

**Why:** The uploaded W3C dummy PDF refused iframe embedding with `X-Frame-Options: sameorigin`, producing a browser error and leaving the resources area unusable.

**How to apply:** Replace the local preview with a real uploaded PDF or authorized document URL only when the user provides one that is intended for embedding.