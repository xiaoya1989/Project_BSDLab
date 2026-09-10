# BSD Lab Website — Codex Instructions

## Project purpose

This repository contains the public BSD Lab website. Treat every committed file as potentially public. Prefer small, reviewable content changes and preserve the existing React/Vite architecture unless the website owner explicitly requests a program or design change.

Before editing, read `README.md`, `content/README.md`, and `docs/content-maintenance.md`.

## Default student scope

Students may normally edit only the files needed for the assigned content update:

- `content/posts/*.md` and `public/posts/<slug>/` for news and activity posts.
- `content/site-content.json` for approved fixed copy.
- `team_members/<member>/` for approved member profiles and portraits.
- `exported-references.bib`, `publications_annotation_template.csv`, and, when necessary, `src/publication_doi_overrides.json` for publication records.

Do not modify the following unless the website owner explicitly asks for that exact change:

- `src/`, except `src/publication_doi_overrides.json` for a verified publication correction.
- `.github/`, `package.json`, `package-lock.json`, `vite.config.js`, or `CNAME`.
- Deployment, domain, dependency, secret, or WeChat integration settings.

If a requested task appears to require a protected file, stop and explain why before editing it.

## Privacy and publication safety

- Never commit passwords, tokens, API keys, WeChat credentials, patient or participant information, unpublished research data, internal correspondence, or private contact details.
- Do not commit raw recordings, transcripts, slide decks, entire source-material folders, or unrelated photographs. Copy only the final approved web assets into the appropriate public directory.
- Confirm that names, portraits, contact details, photographs, and full-text papers are authorized for public release.
- Do not delete or overwrite original source materials while preparing web assets.
- Keep `publish_to_wechat: false` unless the website owner explicitly asks to create a WeChat draft.

## Content rules

- For a new post, copy `content/templates/post-template.md`; do not edit the template itself.
- The Markdown filename and frontmatter `slug` must match and use lowercase letters, numbers, and hyphens.
- Write equivalent Chinese and English titles, summaries, and body content under the existing `<!-- zh -->` and `<!-- en -->` markers.
- Verify names, dates, affiliations, paper status, DOI values, and links against the supplied public source material. Do not invent missing facts.
- Put post images in `public/posts/<slug>/`, use clear filenames, add meaningful alt text and captions, and keep ordinary web images near or below 1 MB when practical.
- Preserve the existing JSON, CSV, BibTeX, and Markdown structures. Do not remove fields merely because they are empty or unfamiliar.
- Follow the existing visual language and article layout. Make only the layout changes necessary for the assigned content.

## Working procedure

1. Start from the latest `main` and create one task branch named `content/<short-description>`.
2. Inspect source materials and state any material uncertainty before publishing a claim.
3. Change only files that belong to the current task. Preserve unrelated user work and untracked files.
4. Run `npm ci` if dependencies are not installed, then run `npm run check` before proposing completion.
5. Review `git status` and the diff. Stage explicit paths; do not use `git add .`.
6. Create a Pull Request using `.github/PULL_REQUEST_TEMPLATE.md` and report any unresolved content or permission question.
7. Do not push directly to `main`, bypass checks, merge the Pull Request, publish the site, or create a WeChat draft unless the website owner explicitly authorizes that action.

## Completion requirements

A content task is complete only when:

- The Chinese and English versions agree on names, dates, organizations, and claims.
- Public image paths resolve and captions describe the relevant content.
- `npm run check` passes, or the exact pre-existing warning or blocking error is reported.
- The final summary lists the modified files, validation result, and any item that still requires the website owner's review.

## Code review rules

- Flag any change outside the default student scope unless the task explicitly required it.
- Flag secrets, sensitive data, unpublished material, unauthorized personal information, or raw recordings even if validation passes.
- Flag direct-to-`main` publication, disabled checks, hidden deployment changes, or unexpected dependency changes.
- Flag Chinese/English factual mismatches, broken public asset paths, unsupported claims, missing image attribution or consent, and `publish_to_wechat: true` without explicit approval.
