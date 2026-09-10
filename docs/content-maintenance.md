# BSD Lab 网站学生维护手册

这份手册面向负责更新实验室网站内容的同学。基本原则是：**一次更新一个分支，通过 Pull Request 提交，由网站负责人审核后上线。**

## 1. 哪些内容可以修改

| 更新内容 | 主要文件 | 是否适合学生直接维护 |
| --- | --- | --- |
| 实验室新闻、活动、招生信息 | `content/posts/*.md`、`public/posts/` | 是 |
| 首页固定文案、研究方向、教师介绍 | `content/site-content.json` | 是，需保持中英文结构一致 |
| 成员介绍与头像 | `team_members/<member>/` | 是 |
| 论文条目与作者标记 | `exported-references.bib`、`publications_annotation_template.csv` | 是，但需仔细核对 |
| 论文信息纠错 | `src/publication_doi_overrides.json` | 是，建议负责人复核 |
| 页面样式、功能、部署、域名 | `src/`、`.github/`、`vite.config.js`、`CNAME` | 否 |

不要把密码、API 密钥、微信公众号密钥、患者/被试信息、未公开数据或内部材料提交到仓库。

## 2. 每次更新的标准流程

### 通过 GitHub 网页更新

1. 打开仓库，确认当前分支为 `main`。
2. 使用分支选择器，从最新 `main` 创建一个新分支：
   - 新闻：`content/news-short-title`
   - 成员：`content/member-name`
   - 论文：`content/publication-short-title`
3. 在新分支中打开需要修改的文件，点击铅笔图标编辑；图片可使用 **Add file → Upload files** 上传。
4. 每完成一组相关修改就提交一次，提交说明写清楚，例如 `Add 2026 lab retreat update`。
5. 点击 **Compare & pull request**，按照模板完成检查项。
6. 等待 `Validate and build` 通过，并处理负责人的修改意见。
7. 由负责人合并。不要自行绕过检查或直接修改 `main`。

### 在本地更新

```bash
git switch main
git pull --ff-only
git switch -c content/news-short-title
npm ci
npm run dev
```

修改完成后运行：

```bash
npm run validate:content
npm run build
git status
```

只提交本次任务涉及的文件，不要使用 `git add .` 把无关文件一起提交。

## 3. 发布一篇新闻

1. 复制 `content/templates/post-template.md` 到 `content/posts/`。
2. 将文件名和 `slug` 同时改成简短的英文小写名称，只使用字母、数字和连字符。例如：

   ```text
   content/posts/lab-retreat-2026.md
   slug: lab-retreat-2026
   ```

3. 把图片放到：

   ```text
   public/posts/lab-retreat-2026/
   ```

4. 填写中英文标题、摘要与正文。中文写在 `<!-- zh -->` 后，英文写在 `<!-- en -->` 后。
5. 每张正文图片都填写有意义的说明：

   ```md
   ![BSD Lab 2026 年团队合影](/posts/lab-retreat-2026/group-photo.jpg)
   ```

6. 默认保持 `publish_to_wechat: false`。只有确认需要同步到微信公众号草稿箱时才改为 `true`。

图片建议：

- 封面优先使用横图，推荐宽度 1600–2400 px。
- 普通网页图片尽量控制在 1 MB 以内。
- 不上传聊天截图、带有无关个人信息的照片或来源不明的网络图片。
- 上传人物照片前先获得本人同意。

## 4. 更新首页固定内容

首页导航、主标题、研究方向、招募文案、论文页说明、团队页说明、页脚和两位教师简介集中保存在 `content/site-content.json`。

1. 同时检查 `copy.en` 与 `copy.zh`，不要删除任何已有字段。
2. 数组项目可以修改文字或调整顺序，但不要把数组改成一段普通文字。
3. 教师资料位于 `faculty.han` 和 `faculty.shen`；照片仍由网站负责人维护。
4. JSON 不能写注释，字符串中的英文双引号需要写成 `\"`。
5. 修改后必须运行内容校验并预览中英文首页、论文页和团队页。

## 5. 更新或添加成员

### 更新已有成员

打开对应的 `team_members/<member>/profile.json` 修改。不要删除字段，不要在 JSON 中添加注释，并保留英文双引号和逗号。

常用角色值：

- `MASTER STUDENT`
- `PHD STUDENT`
- `POSTDOCTORAL RESEARCHER`
- `ALUMNI`

### 添加新成员

1. 在 `team_members/` 新建英文小写目录，例如 `lin-zhang/`。
2. 将 `docs/templates/member-profile.json` 复制为该目录下的 `profile.json`。
3. 在同一目录放一张头像，支持 `.jpg`、`.jpeg` 或 `.png`。
4. 一个成员目录只放一张用于网站展示的图片，否则系统无法确定使用哪一张。
5. 运行内容校验并预览团队页面。

成员简介应以研究方向、使用方法和当前课题为主。邮箱、主页和照片必须确认允许公开。

## 6. 更新论文

论文页面会合并多个来源。常规更新需要同时完成前两步：

1. 将新论文的 BibTeX 条目加入 `exported-references.bib`。条目作者中需要包含 `Biao Han`/`Han, Biao` 或 `Lu Shen`/`Shen, Lu`。
2. 在 `publications_annotation_template.csv` 添加对应行。该表既决定论文是否显示，也控制韩彪、沈路姓名的加粗、共同一作 `*` 和通讯作者 `#` 标记。
3. 如果 DOI、年份、期刊名、作者顺序或链接需要修正，在 `src/publication_doi_overrides.json` 添加覆盖项。
4. 如需提供站内 PDF，将文件放入 `public/papers/`，链接写成 `/papers/file-name.pdf`。确认版权允许后再上传全文。

CSV 中的标记值：

- `Y`：明确启用
- `N`：明确关闭
- 留空：沿用程序自动判断

论文状态容易变化，预印本转为正式发表后要同时检查标题、DOI、年份、期刊和链接，避免保留重复条目。

## 7. 自动检查失败怎么办

Pull Request 中打开失败的 `Validate and build`，查看红色步骤：

- `Validate content` 失败：通常是 JSON 格式、新闻字段、图片路径或中英文标记错误。日志会显示具体文件。
- `Build website` 失败：可能修改到了程序结构或依赖，请联系网站负责人。
- 微信同步失败不会阻止网站部署，但需要负责人检查微信公众号配置和草稿内容。

修复后继续提交到同一分支，Pull Request 会自动重新检查，不需要新建第二个 Pull Request。

## 8. 负责人一次性设置

以下设置需要仓库所有者在 GitHub 网站完成：

1. **Settings → Collaborators**：邀请学生，授予 `Write`，不要授予 `Admin`。
2. **Settings → Rules → Rulesets → New branch ruleset**：目标选择默认分支或 `main`，启用：
   - Require a pull request before merging
   - Required approvals: 1
   - Dismiss stale pull request approvals when new commits are pushed
   - Require review from Code Owners
   - Require conversation resolution before merging
   - Require status checks to pass：选择 `Validate content and build`
   - Block force pushes
   - Restrict deletions
3. 不允许学生加入 bypass list。
4. 在 GitHub Pages 和微信公众号仍正常工作的前提下，再正式让学生开始提交内容。

参考文档：

- [GitHub 网页编辑文件](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files)
- [GitHub Repository Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## 9. 负责人审核清单

- 内容是否准确、已经公开且适合长期留在官网。
- 中英文是否表达同一事实，姓名、日期、单位和论文状态是否一致。
- 图片是否得到授权，是否暴露个人或研究敏感信息。
- Pull Request 是否只包含与本次更新有关的文件。
- 自动检查是否通过，预览页面是否正常。
- 如启用微信草稿，微信封面、摘要与网页链接是否合适。
