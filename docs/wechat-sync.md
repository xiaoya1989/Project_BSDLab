# WeChat Sync Setup

This project can publish website updates to a WeChat Official Account draft automatically after GitHub pushes.

## Content authoring

- Put new lab updates in `content/posts/*.md`.
- Use YAML frontmatter at the top of each file.
- Separate Chinese and English bodies with:

```md
<!-- zh -->
Chinese content here.

<!-- en -->
English content here.
```

## Required frontmatter

```yaml
slug: website-launch
date: 2026-03-18
title_zh: BSD Lab 网站上线
title_en: BSD Lab Website Launch
summary_zh: 中文摘要
summary_en: English summary
cover_image: /posts/default-cover.svg
wechat_cover_image: /posts/default-cover.svg
tags:
  - website
  - lab update
publish_to_wechat: true
```

## GitHub Secrets

Add these repository secrets before enabling WeChat draft publishing:

- `WECHAT_APP_ID`
- `WECHAT_APP_SECRET`
- `WECHAT_AUTHOR_NAME` (optional, defaults to `BSD Lab`)
- `WEBSITE_ORIGIN` (recommended, e.g. `https://bsd-lab.org`)

If the WeChat secrets are missing, the workflow will still deploy the website and only skip draft creation.
