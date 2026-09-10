# 学生使用 Codex 维护 BSD Lab 网站：快速上手

这份指南适用于实验室新闻、成员资料、论文信息和已批准的首页文案更新。基本原则是：**Codex 协助修改，学生检查并提交 Pull Request，网站负责人审核合并后上线。**

## 1. 准备自己的账号和软件

请使用自己的账号，不要共用负责人的账号或密钥。

- GitHub 账号，并由仓库负责人授予 `Write` 权限。
- ChatGPT/Codex 账号；本地 Codex 也可以使用本人独立的 API 密钥。
- Git。
- Node.js 20 或更高版本。
- ChatGPT 桌面应用中的 Codex、Codex CLI 或 Codex IDE 扩展任选一种。

OpenAI 官方说明：

- [Codex 身份验证](https://learn.chatgpt.com/zh-Hans/docs/auth)
- [使用 AGENTS.md 设置项目指令](https://learn.chatgpt.com/docs/agent-configuration/agents-md)

## 2. 第一次下载网站

在终端运行：

```bash
git clone https://github.com/xiaoya1989/Project_BSDLab.git
cd Project_BSDLab
npm ci
npm run check
```

然后在 ChatGPT/Codex 中打开整个 `Project_BSDLab` 文件夹，不要只打开某一个 Markdown 文件或素材文件夹。

创建一个新任务后，先发送：

```text
请先完整阅读 AGENTS.md、README.md、content/README.md 和
docs/content-maintenance.md，然后概括本次任务允许修改的目录、
禁止修改的目录以及完成前必须运行的检查。暂时不要修改文件。
```

确认 Codex 的回答正确后，再发送具体任务。

## 3. 每次更新的标准流程

让 Codex按以下顺序处理：

1. 同步最新 `main`。
2. 创建一个新的 `content/...` 分支。
3. 检查素材，指出不确定或不适合公开的信息。
4. 只修改本次任务需要的内容文件和最终配图。
5. 运行 `npm run check`。
6. 展示修改摘要和文件清单，等待学生检查。
7. 提交并推送分支，创建 Pull Request。
8. 等待网站负责人审核；学生不得自行合并或发布。

推荐分支名：

- 新闻：`content/news-short-title`
- 成员：`content/member-name`
- 论文：`content/publication-short-title`

一个分支只做一件事。如果正在处理另一项更新，应另建分支和 Pull Request。

## 4. 通用提示词模板

将尖括号中的内容替换为本次任务的信息：

```text
请先遵守 AGENTS.md 和 docs/content-maintenance.md。

任务：<例如：根据“2026 暑期学校”活动材料新增一篇网站动态>
素材位置：<本地文件夹的完整路径>
目标页面：<新闻、成员、论文或首页>

要求：
1. 从最新 main 创建 content/<short-description> 分支。
2. 只修改本次任务涉及的内容文件和最终网页图片。
3. 同时完成中文和英文，姓名、日期、单位和事实必须一致。
4. 不上传原始录音、逐字稿、PPT、整个素材文件夹、未公开数据或无关照片。
5. 图片需要压缩并配有准确的说明文字；不要覆盖原始素材。
6. 不修改 src、.github、依赖、CNAME 或部署配置。
7. 保持 publish_to_wechat: false，除非负责人明确要求同步微信草稿。
8. 完成后运行 npm run check，列出全部修改文件并说明检查结果。
9. 在我确认后再提交和创建 Pull Request；不要合并或发布。

如果素材之间存在冲突、信息不完整或涉及隐私，请先指出，不要自行猜测。
```

## 5. 常见任务提示词

### 发布新闻或活动

```text
使用 content/templates/post-template.md 新建新闻。文件名和 slug 保持一致，
图片放到 public/posts/<slug>/。先从素材中整理准确的时间、地点、人物和主题，
再撰写中英文正文。只选适合公开且能支持正文内容的照片。
```

### 更新成员资料

```text
更新 team_members/<member>/profile.json，保留所有既有字段和 JSON 结构。
简介重点写研究方向、使用方法和当前课题。邮箱、主页和照片只有在确认允许公开时才能加入。
```

### 更新论文

```text
核对论文标题、作者顺序、期刊、年份、DOI 和正式链接。
按 docs/content-maintenance.md 同步更新 BibTeX 与 CSV 标记；
只有在版权允许且负责人确认后，才能加入站内全文 PDF。
```

## 6. 学生提交前检查

- `git status` 中没有素材原件、录音、逐字稿或无关文件。
- 中文和英文表达同一事实。
- 姓名、日期、单位、论文状态和链接准确。
- 照片和联系方式已获公开授权。
- 图片路径、替代文字和说明文字正确。
- `npm run check` 已通过。
- Pull Request 只包含本次任务相关文件。
- 没有修改受保护的程序、部署或域名文件。

若 Codex 建议跳过检查、直接修改 `main`、关闭自动检查或上传密钥，应拒绝该建议并联系网站负责人。

## 7. Pull Request 之后

提交 PR 后等待 `Validate and build`：

- 检查通过：等待负责人审核。
- 内容检查失败：把失败日志交给 Codex，让它只修复对应内容文件。
- 网站构建失败或需要修改受保护文件：停止操作并联系负责人。
- 负责人提出修改意见：继续在同一分支修正，不要新建重复 PR。

负责人合并后，GitHub Pages 会自动发布。学生不需要单独操作部署。
