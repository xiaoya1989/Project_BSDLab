# 网站内容编辑与审核系统

网站使用 Decap CMS 作为内容编辑界面，编辑入口为：

```text
https://bsd-lab.org/admin/
```

它只负责编辑 Git 仓库中的公开网站内容，不保存额外的内容数据库。当前第一阶段只开放“实验室动态”，避免学生误改程序、部署配置、论文库或成员隐私信息。

## 工作流

1. 学生使用自己的 GitHub 账号登录编辑后台。
2. 学生新建或编辑一篇动态，分别填写中文和英文版本并上传图片。
3. 学生在“工作流”中把草稿移动到“等待审核 / Ready to Review”。
4. 系统从学生自己的 GitHub fork 创建 Pull Request；学生不能从后台直接发布。
5. 网站负责人检查中英文事实、图片授权和自动校验结果后，在 GitHub 合并 Pull Request。
6. 合并到 `main` 后，现有 GitHub Actions 自动部署网站。

Decap CMS 的 Open Authoring 模式会把无仓库写权限用户的改动放在个人 fork 中。学生不需要被添加为仓库 Collaborator；建议保持这一点，以免绕过审核流程。

## 学生可编辑范围

- `content/posts/*.md`
- 与文章同名目录中的公开图片：`public/posts/<slug>/`

后台不提供以下内容的编辑入口：

- 程序代码、依赖和部署配置
- 微信发布开关（后台始终默认为 `false`）
- 原始录音、转录全文、PPT 源文件和活动素材文件夹
- 未公开研究数据、受试者信息、内部邮件或私密联系方式

每篇文章需要填写等价的中英文标题、摘要和正文。姓名、日期、单位、论文状态、DOI 和链接必须根据公开材料核对，不能补写无法确认的信息。

## 图片要求

- 只上传确认可以公开使用的图片。
- 优先使用清楚、横向、能说明正文内容的照片。
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

审核通过后由网站负责人合并 Pull Request。不要把学生添加为具有直接写入权限的 Collaborator，也不要允许任何人绕过 Pull Request 直接推送到 `main`。

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
6. 用一个没有仓库写权限的测试 GitHub 账号完整验证“新建草稿 → Ready to Review → Pull Request → 审核 → 合并 → 部署”。

如不希望维护 OAuth 中转，也可以改用 Decap Turbo 托管登录；它需要单独建立 Decap Turbo 组织和站点，团队席位可能产生费用。

## 本地预览编辑器

开发者可在本机运行 Decap Proxy，再启动网站：

```bash
npx decap-server
npm run dev
```

本地调试时可临时在 `public/admin/config.yml` 顶层加入 `local_backend: true`。该临时设置不要提交到生产分支。
