# Walkthrough and Acceptance

AI 设计走查与验收协作工作台。支持上传设计稿和开发截图、调用视觉模型识别问题、人工标注、FE 修复流转、UI 复核归档，以及通过后端共享同一个项目状态。

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
