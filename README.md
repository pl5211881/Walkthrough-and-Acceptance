# Walkthrough and Acceptance

AI 设计走查与验收协作工作台。支持上传设计稿和开发截图、调用视觉模型识别问题、人工标注、FE 修复流转、UI 复核归档，以及通过后端共享同一个项目状态。

## 当前访问地址

| 类型 | 地址 | 说明 |
| --- | --- | --- |
| Vercel 线上预览 | https://walkthrough-and-acceptance.vercel.app | 已部署，可访问页面与 Serverless API |
| Vercel 部署详情 | https://vercel.com/hl5211881/walkthrough-and-acceptance | 查看部署记录、日志和域名 |
| GitHub 仓库 | https://github.com/pl5211881/Walkthrough-and-Acceptance | 项目源码仓库 |
| 当前开发分支 | https://github.com/pl5211881/Walkthrough-and-Acceptance/tree/codex/server-collaboration-deploy | 当前已推送分支 |
| 本地服务 | http://127.0.0.1:4175/ | 推荐完整体验：可本地保存、上传图片、访问内网模型 |
| 健康检查 | https://walkthrough-and-acceptance.vercel.app/api/workspace | 线上 API 检查入口 |

## 当前部署状态

| 能力 | 本地 / 内网部署 | Vercel 线上 |
| --- | --- | --- |
| 页面访问 | 支持 | 支持 |
| 项目数据保存 | 支持，写入 `data/workspace.json` | 仅浏览器本地草稿，Vercel 文件系统只读 |
| 图片上传保存 | 支持，写入 `data/uploads/` | 仅浏览器本地草稿，需接对象存储才可共享 |
| 协作链接编辑 | 局域网/内网可共享同一份服务端数据 | 页面可打开，但数据不会跨浏览器长期共享 |
| 内网模型网关 | 支持访问公司内网/API 网关 | 不支持访问 `baidu-int.com` 等内网/受限地址 |
| 公网模型网关 | 支持 | 支持，取决于 API Key 和模型视觉能力 |

> 说明：当前 Vercel 部署主要用于在线预览。若要正式多人协作，请接入外部数据库/对象存储，或部署到支持持久化磁盘且能访问公司内网模型网关的环境。

## 本地启动

```bash
npm start
```

默认端口为 `4174`，可通过环境变量指定：

```bash
PORT=4175 npm start
```

启动后访问：

```text
http://127.0.0.1:4175/
```

## 协作分享

服务端会监听 `0.0.0.0`，同一局域网内可使用启动日志里的 `LAN share` 地址访问。页面内「导出问题清单」菜单提供「复制协作链接」，可发送给 FE 或其他 UI 继续编辑、评论和推进状态。

## 数据存储

- 项目数据：`data/workspace.json`
- 上传图片：`data/uploads/`

这些运行时数据默认不提交到 Git。生产部署时建议挂载持久化磁盘，避免重启或重新部署后丢失协作数据。

## 模型接口

在页面右上角「模型配置」中填写 OpenAI Compatible 接口：

- Base URL
- 模型名称
- API Key

服务端提供模型代理接口，避免浏览器直连模型服务造成 CORS 问题。

## 部署

这是一个标准 Node 服务，部署平台需要支持 Node 运行时和持久化文件存储。推荐：

- Render Web Service
- Railway
- Fly.io
- 自有服务器 / NAS / 内网主机

启动命令：

```bash
npm start
```

健康检查可访问：

```text
/api/workspace
```

### Render Blueprint 部署

仓库已包含 `render.yaml`，可在 Render 中选择 Blueprint 方式导入 GitHub 仓库：

```text
pl5211881/Walkthrough-and-Acceptance
```

推荐使用包含 Persistent Disk 的实例。协作数据和上传截图会写入 `DATA_DIR`，默认 Render 配置为：

```text
/var/data
```

不建议使用 GitHub Pages 部署本项目，因为 GitHub Pages 只能托管静态文件，无法运行以下后端能力：

- 项目协作保存
- 图片上传
- 模型代理
- 共享链接编辑

### Vercel 部署

仓库已包含 `vercel.json`。部署前如果修改了 `index.html`、`app.js`、`styles.css` 或默认图片，请先同步静态目录：

```bash
npm run sync:public
```

然后执行：

```bash
vercel deploy --prod
```

当前 Vercel 部署采用静态前端 + Serverless API。它可以用于在线预览和轻量协作，但 Vercel Serverless 的本地文件系统不适合长期保存协作数据和上传截图；正式团队协作仍建议迁移到外部数据库/对象存储，或使用支持持久化磁盘的部署平台。
