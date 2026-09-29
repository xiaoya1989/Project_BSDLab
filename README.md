# BSD Lab Website

Brain State Dynamics Lab（BSD Lab）官方网站源码。网站使用 React + Vite 构建，内容合并到 `main` 分支后由 GitHub Actions 自动发布到 GitHub Pages。

## 学生维护入口

网页编辑后台：[`https://bsd-lab.org/admin/`](https://bsd-lab.org/admin/)。建议指定 1–2 名学生担任网站内容编辑，在后台维护实验室动态和成员资料；所有改动仍通过 Pull Request 交由网站负责人审核。

学生日常只需要维护以下内容：

- `content/posts/`：实验室动态、活动、招生与项目新闻
- `content/site-content.json`：首页固定文案、研究方向和教师介绍
- `public/posts/`：新闻配图
- `team_members/`：成员简介与头像
- `exported-references.bib`：从文献管理软件导出的论文记录
- `publications_annotation_template.csv`：论文筛选及作者标记
- `src/publication_doi_overrides.json`：论文 DOI、作者、期刊或链接修正

完整操作说明见 [`docs/content-maintenance.md`](docs/content-maintenance.md)。

## 推荐协作流程

1. 从最新 `main` 创建 `content/...` 分支。
2. 只修改本次任务涉及的内容和图片。
3. 提交 Pull Request，不直接提交到 `main`。
4. 等待 `Validate and build` 自动检查通过。
5. 由网站负责人审核并合并。
6. 合并后 GitHub Pages 自动发布；启用微信密钥时，符合条件的新闻会进入微信公众号草稿箱。

## 使用 Codex 更新网站

适用于已经获得本仓库 `Write` 权限的指定内容编辑。学生必须使用自己的 GitHub 和 Codex 账号，不要共享网站负责人的账号、令牌或登录状态。

1. 接受网站负责人发出的 GitHub 仓库邀请。
2. 在 Codex 中克隆或打开本仓库，并确认使用的是学生自己的 GitHub 账号。
3. 把本次更新的文案、日期和已确认可公开的照片提供给 Codex。不要把原始录音、完整 PPT、未公开数据或整个素材文件夹提交到仓库。
4. 将下面的提示词连同本次更新要求发送给 Codex：

   ```text
   请按照仓库根目录的 AGENTS.md 更新 BSD Lab 网站。先同步最新 main，并创建 content/<简短英文说明> 分支。只修改本次内容需要的文件；动态需要完整且事实一致的中英文标题、摘要和正文，图片只使用已确认可以公开的素材，并填写有意义的替代文字。完成后运行 npm run check，检查 git diff，只提交明确相关的文件，然后推送分支并创建 Pull Request 交给网站负责人审核。不要直接推送或合并 main，不要自行上线，也不要创建微信草稿。
   ```

5. Codex 完成后，学生检查中文、英文、图片和改动文件列表，将 Pull Request 链接发给网站负责人。
6. 网站负责人审核并合并；学生不得自行绕过检查、批准或发布。

Codex 会自动读取仓库中的 [`AGENTS.md`](AGENTS.md)，其中已经规定了学生可编辑范围、隐私要求、检查步骤和禁止直接发布的边界。相关机制可参考 [OpenAI 官方的 AGENTS.md 说明](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。网页后台与 Codex 可以任选一种方式完成一次更新，但同一篇内容不要同时在两个入口编辑，以免产生冲突。

## 本地检查

需要 Node.js 20 或更高版本。

```bash
npm ci
npm run validate:content
npm run dev
```

提交前建议运行完整检查：

```bash
npm run check
```

## 权限边界

- 学生：新闻、首页固定文案、成员、论文资料和对应图片。
- 网站负责人：`src/`、`.github/`、依赖、域名、部署和微信公众号密钥。
- 任何包含个人联系方式、未公开成果或患者/被试信息的内容，发布前必须由负责人确认。
