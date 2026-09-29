# 网站内容编辑与审核系统

网站使用 Decap CMS 作为内容编辑界面，编辑入口为：

```text
https://bsd-lab.org/admin/
```

它只负责编辑 Git 仓库中的公开网站内容，不保存额外的内容数据库。后台当前开放“实验室动态”和“成员资料管理”，程序、部署配置、论文库等内容仍不提供编辑入口。

建议指定 1–2 名学生担任网站内容编辑。其他成员不需要学习后台或分别维护账号，只需按统一模板把资料交给内容编辑，由内容编辑统一录入并提交网站负责人审核。

## 工作流

1. 指定的内容编辑使用自己的 GitHub 账号登录编辑后台。
2. 内容编辑新建或编辑一篇动态，或者根据成员提交的资料更新“成员资料管理”。
3. 内容编辑在“工作流”中把草稿移动到“等待审核 / Ready to Review”。
4. 系统在仓库中创建内容分支和 Pull Request；内容编辑不能绕过审核直接发布。
5. 网站负责人检查中英文事实、图片授权和自动校验结果后，在 GitHub 合并 Pull Request。
6. 合并到 `main` 后，现有 GitHub Actions 自动部署网站。

后台已关闭 Open Authoring。只有被网站负责人添加为仓库 Collaborator、且具有 `Write` 权限的指定内容编辑才能登录和提交内容；其他 GitHub 用户不能进入编辑流程。`main` 分支必须启用保护规则，要求 Pull Request、自动检查和至少一次负责人审核，学生不得加入 bypass list。

## 学生可编辑范围

- `content/posts/*.md`
- 与文章同名目录中的公开图片：`public/posts/<slug>/`
- 已获成员确认的公开资料：`team_members/<member>/profile.json`

“成员资料管理”会列出现有成员姓名。Decap CMS 本身不支持按照 GitHub 登录账号做单文件授权，因此不建议让每位成员分别登录维护。只把 1–2 名指定内容编辑添加为具有 `Write` 权限的 Collaborator；不要授予 `Maintain` 或 `Admin`。提交使用的 GitHub 账号会显示在 Pull Request 中，网站负责人应拒绝来源或授权不清楚的资料改动。

个人主页可以修改中英文姓名、成员身份、专业方向、入学/毕业年份、公开邮箱、研究关键词、英文简介和公开链接。邮箱、主页及简介会公开显示；不要填写私人联系方式、未公开结果或患者/受试者信息。头像暂不通过后台替换，如需更换，请把确认可公开的照片交给网站负责人处理。

成员可填写 [`docs/templates/member-profile-update.md`](templates/member-profile-update.md) 后交给内容编辑。内容编辑应保留成员对姓名、公开邮箱、链接、简介和照片公开使用的确认记录。

后台不提供以下内容的编辑入口：

- 程序代码、依赖和部署配置
- 微信发布开关（后台始终默认为 `false`）
- 原始录音、转录全文、PPT 源文件和活动素材文件夹
- 未公开研究数据、受试者信息、内部邮件或私密联系方式

每篇文章需要填写等价的中英文标题、摘要和正文。姓名、日期、单位、论文状态、DOI 和链接必须根据公开材料核对，不能补写无法确认的信息。

## 图片要求

- 只上传确认可以公开使用的图片。
- 优先使用清楚、横向、能说明正文内容的照片。
- 封面和正文插图都可直接把本地图片拖到上传区，或点击选择文件；不需要另行填写图片 URL。
- 在正文工具栏选择“拖拽上传图片”，上传后填写能说明人物、场景或 PPT 内容的替代文字。
- 上传图片会保存到 `public/posts/<slug>/`，并在浏览器中压缩、移除图片元数据。
- 单张图片建议不超过 1 MB；后台限制为 1.5 MB。
- 文件名使用简短英文，例如 `lecture-hall.jpg` 或 `meg-sensor-slide.jpg`。
- 图片替代文字和图注需要说明图片内容，不要只写“图片 1”。

## 网站负责人审核清单

- 中英文中的姓名、日期、单位和结论是否一致。
- 图片、肖像和联系方式是否获得公开授权。
- 是否包含患者或受试者信息、未发表数据、内部资料或原始录音。
- 图片路径是否正确，文件大小和裁切是否适合网页。
- `publish_to_wechat` 是否保持为 `false`。
- Pull Request 中的 `npm run check` 是否通过。
- Diff 是否只包含本次文章及其公开图片。

审核通过后由网站负责人合并 Pull Request。只给指定内容编辑 `Write` 权限，不要授予 `Maintain` 或 `Admin`；同时使用 `main` 分支保护规则阻止学生绕过 Pull Request 直接上线。

## 一次性登录配置（网站负责人）

GitHub 登录需要一个服务端 OAuth 中转，不能把 GitHub Client Secret 放进本仓库。当前生产地址为：

```text
https://bsd-lab-cms-auth.393649680.workers.dev/auth
```

上线前需要完成：

1. 在网站负责人 GitHub 账号的 **Settings → Developer settings → OAuth Apps** 新建 OAuth App。
2. Homepage URL 填 `https://bsd-lab.org`。
3. Authorization callback URL 填 OAuth 中转服务给出的 callback 地址。
4. 在 Cloudflare Worker（或其他受控服务端）中设置 `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET`；它们只能作为服务端 Secret 保存，不能提交到 Git。
5. 当前使用 Cloudflare 提供的 `workers.dev` 地址；以后如将网站 DNS 接入 Cloudflare，可再选配 `auth.bsd-lab.org` 自定义域名，并同步修改后台配置与 GitHub callback 地址。
6. 邀请一个测试编辑账号作为 `Write` Collaborator，完整验证“新建草稿 → Ready to Review → Pull Request → 审核 → 合并 → 部署”；测试完成后及时移除不再需要的权限。

如不希望维护 OAuth 中转，也可以改用 Decap Turbo 托管登录；它需要单独建立 Decap Turbo 组织和站点，团队席位可能产生费用。

## 本地预览编辑器

开发者可在本机运行 Decap Proxy，再启动网站：

```bash
npx decap-server
npm run dev
```

本地调试时可临时在 `public/admin/config.yml` 顶层加入 `local_backend: true`。该临时设置不要提交到生产分支。
