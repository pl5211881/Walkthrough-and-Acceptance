const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const WORKSPACE_FILE = path.join(DATA_DIR, "workspace.json");
const PORT = Number(process.env.PORT || 4174);
const MAX_BODY_SIZE = 80 * 1024 * 1024;
const VISION_TEST_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAK0lEQVR4nO3NMQEAMAjAsDGZGEUemIAvFdBEdb7L/ukdAAAAAAAAAAAALDaP4wJQf7+CPwAAAABJRU5ErkJggg==";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(JSON.stringify(payload));
}

function readWorkspace() {
  try {
    if (!fs.existsSync(WORKSPACE_FILE)) return null;
    return JSON.parse(fs.readFileSync(WORKSPACE_FILE, "utf8"));
  } catch (error) {
    console.error("读取 workspace 失败", error);
    return null;
  }
}

function writeWorkspace(workspace) {
  const payload = {
    ...workspace,
    serverSavedAt: new Date().toISOString(),
  };
  const tempFile = `${WORKSPACE_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(payload, null, 2));
  fs.renameSync(tempFile, WORKSPACE_FILE);
  return payload;
}

function isReadOnlyFileSystemError(error) {
  return error?.code === "EROFS" || String(error?.message || error).includes("read-only file system");
}

function dataUrlToFile(dataUrl = "", preferredId = "") {
  const match = String(dataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw new Error("图片数据格式无效，请上传 Data URL 图片");
  const mime = match[1].toLowerCase();
  const extensionMap = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  };
  const extension = extensionMap[mime] || ".png";
  const id = String(preferredId || `asset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`)
    .replace(/[^a-zA-Z0-9_-]/g, "-");
  return {
    id,
    mime,
    extension,
    buffer: Buffer.from(match[2], "base64"),
  };
}

async function handleGetWorkspace(req, res) {
  sendJson(res, 200, {
    ok: true,
    workspace: readWorkspace(),
    storageMode: process.env.VERCEL ? "local-only" : "server",
  });
}

async function handleSaveWorkspace(req, res) {
  try {
    const body = JSON.parse(await readRequestBody(req));
    const workspace = body.workspace || body;
    if (!workspace || !Array.isArray(workspace.projects)) {
      sendJson(res, 400, { error: "workspace 数据格式无效" });
      return;
    }
    const saved = writeWorkspace(workspace);
    sendJson(res, 200, {
      ok: true,
      savedAt: saved.serverSavedAt,
    });
  } catch (error) {
    if (isReadOnlyFileSystemError(error)) {
      sendJson(res, 200, {
        ok: false,
        localOnly: true,
        storageMode: "local-only",
        error: "当前部署环境为只读文件系统，协作数据已保留在浏览器本地草稿。",
      });
      return;
    }
    sendJson(res, 500, { error: error.message || "workspace 保存失败" });
  }
}

async function handleUploadAsset(req, res) {
  try {
    const body = JSON.parse(await readRequestBody(req));
    const { id, dataUrl, filename = "" } = body;
    const file = dataUrlToFile(dataUrl, id);
    const fileName = `${file.id}${file.extension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, file.buffer);
    sendJson(res, 200, {
      ok: true,
      assetId: file.id,
      url: `/uploads/${fileName}`,
      filename,
      mime: file.mime,
      updatedAt: new Date().toLocaleString("zh-CN"),
    });
  } catch (error) {
    if (isReadOnlyFileSystemError(error)) {
      sendJson(res, 200, {
        ok: false,
        localOnly: true,
        storageMode: "local-only",
        error: "当前部署环境无法持久保存图片，请使用本地草稿或接入对象存储。",
      });
      return;
    }
    sendJson(res, 400, { error: error.message || "图片上传失败" });
  }
}

async function handleDeleteAsset(req, res) {
  try {
    const body = JSON.parse(await readRequestBody(req));
    const assetId = String(body.assetId || "").replace(/[^a-zA-Z0-9_-]/g, "-");
    if (!assetId) {
      sendJson(res, 400, { error: "缺少 assetId" });
      return;
    }
    const files = fs.readdirSync(UPLOAD_DIR).filter((file) => file.startsWith(`${assetId}.`));
    files.forEach((file) => fs.rmSync(path.join(UPLOAD_DIR, file), { force: true }));
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "图片删除失败" });
  }
}

function sendCorsPreflight(res) {
  res.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end();
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        reject(new Error("上传图片过大，请压缩后重试"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function aiReviewMessages(page) {
  return [
    {
      role: "system",
      content: "你是资深 UI 设计走查助手。只输出 JSON，不要输出 Markdown。根据设计稿和开发截图识别实现差异。bbox 使用百分比数组 [left, top, width, height]，范围 0-100。",
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `请对页面进行设计实现走查。设备尺寸：${page.deviceSize || "未设置"}。返回 JSON：{\"findings\":[{\"title\":\"\",\"priority\":\"P0|P1|P2|P3\",\"type\":\"Layout|Visual|Copy|State|Interaction|Accessibility\",\"area\":\"\",\"confidence\":0.8,\"observed\":\"\",\"expected\":\"\",\"recommendation\":\"\",\"design_bbox\":[0,0,10,10],\"implementation_bbox\":[0,0,10,10]}]}。只输出需要人工核验的问题，按优先级排序。`,
        },
        { type: "image_url", image_url: { url: page.designImageDataUrl } },
        { type: "image_url", image_url: { url: page.implementationImageDataUrl } },
      ],
    },
  ];
}

function aiReviewPayload(model, page, useResponseFormat = true) {
  return {
    model,
    temperature: 0.2,
    ...(useResponseFormat ? { response_format: { type: "json_object" } } : {}),
    messages: aiReviewMessages(page),
  };
}

function visionTestPayload(model) {
  return {
    model,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "请用 JSON 回答：{\"ok\":true}。这是一张 1 像素测试图，用于校验你是否支持图片输入。" },
          { type: "image_url", image_url: { url: VISION_TEST_IMAGE } },
        ],
      },
    ],
  };
}

function shouldRetryWithoutResponseFormat(status, text = "") {
  const normalized = String(text).toLowerCase();
  return status === 400 && (
    normalized.includes("response_format")
    || normalized.includes("json_object")
    || normalized.includes("unsupported")
    || normalized.includes("not support")
  );
}

function humanizeAiError(message = "") {
  let text = String(message || "");
  try {
    const parsed = JSON.parse(text);
    text = parsed.detail || parsed.error?.message || parsed.error || text;
  } catch {
    // Keep plain text errors as-is.
  }
  const normalized = String(text).toLowerCase();
  if (
    normalized.includes("fetch failed")
    || normalized.includes("enotfound")
    || normalized.includes("econnrefused")
    || normalized.includes("etimedout")
    || normalized.includes("network")
  ) {
    return "当前部署环境无法访问该模型 Base URL。若本地可用但线上失败，通常是模型网关为内网地址、公司网络地址或限制了云服务出口访问；请改用公网可访问的模型网关，或将本工具部署到能访问该网关的内网环境。";
  }
  if (
    normalized.includes("unknown variant `image_url`")
    || (normalized.includes("image_url") && normalized.includes("expected `text`"))
    || (normalized.includes("image_url") && normalized.includes("expected text"))
  ) {
    return "当前模型接口不支持图片输入（image_url），请切换支持视觉输入的模型或支持图片消息格式的网关。";
  }
  if (
    normalized.includes("does not represent a valid image")
    || normalized.includes("invalid image")
    || normalized.includes("image data")
  ) {
    return "当前模型接口拒绝 Data URL 图片数据，请确认网关支持 base64 图片输入，或切换支持图片消息格式的视觉模型。";
  }
  if (normalized.includes("response_format") || normalized.includes("json_object")) {
    return "当前模型接口不支持结构化 JSON 参数，系统已尝试兼容重试；如仍失败请更换模型网关。";
  }
  return String(text || "模型请求失败");
}

async function callModel({ baseUrl, model, apiKey, page }, useResponseFormat = true) {
  const endpoint = `${String(baseUrl).replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(aiReviewPayload(model, page, useResponseFormat)),
  });
  const text = await response.text();
  if (!response.ok) {
    const error = new Error(text || `HTTP ${response.status}`);
    error.status = response.status;
    error.body = text;
    throw error;
  }
  return text ? JSON.parse(text) : {};
}

async function callVisionTest({ baseUrl, model, apiKey }) {
  const endpoint = `${String(baseUrl).replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(visionTestPayload(model)),
  });
  const text = await response.text();
  if (!response.ok) {
    const error = new Error(text || `HTTP ${response.status}`);
    error.status = response.status;
    error.body = text;
    throw error;
  }
  return text ? JSON.parse(text) : {};
}

async function handleVisionTest(req, res) {
  try {
    const body = JSON.parse(await readRequestBody(req));
    const { baseUrl, model, apiKey } = body;
    if (!baseUrl || !model || !apiKey) {
      sendJson(res, 400, { error: "请先填写 Base URL、模型名称和 API Key" });
      return;
    }
    await callVisionTest({ baseUrl, model, apiKey });
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, error.status || 500, {
      error: humanizeAiError(error.body || error.message || error),
      detail: String(error.body || error.message || error).slice(0, 2000),
    });
  }
}

async function handleAiReview(req, res) {
  try {
    const body = JSON.parse(await readRequestBody(req));
    const { baseUrl, model, apiKey, page } = body;
    if (!baseUrl || !model || !apiKey) {
      sendJson(res, 400, { error: "请先填写 Base URL、模型名称和 API Key" });
      return;
    }
    if (!page?.designImageDataUrl || !page?.implementationImageDataUrl) {
      sendJson(res, 400, { error: "请先上传设计稿和开发截图" });
      return;
    }

    let data;
    try {
      data = await callModel({ baseUrl, model, apiKey, page }, true);
    } catch (error) {
      if (!shouldRetryWithoutResponseFormat(error.status, error.body || error.message)) throw error;
      data = await callModel({ baseUrl, model, apiKey, page }, false);
    }

    sendJson(res, 200, data);
  } catch (error) {
    sendJson(res, error.status || 500, {
      error: humanizeAiError(error.body || error.message || error),
      detail: String(error.body || error.message || error).slice(0, 2000),
    });
  }
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  const pathname = decodeURIComponent(requestUrl.pathname);
  const staticRoot = pathname.startsWith("/uploads/") ? DATA_DIR : ROOT;
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(staticRoot, cleanPath));
  if (!filePath.startsWith(staticRoot)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(content);
  });
}

function handleRequest(req, res) {
  if (req.method === "OPTIONS") {
    sendCorsPreflight(res);
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/api/ai-review")) {
    handleAiReview(req, res);
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/api/test-vision")) {
    handleVisionTest(req, res);
    return;
  }
  if (req.method === "GET" && req.url?.startsWith("/api/workspace")) {
    handleGetWorkspace(req, res);
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/api/workspace")) {
    handleSaveWorkspace(req, res);
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/api/upload-asset")) {
    handleUploadAsset(req, res);
    return;
  }
  if (req.method === "POST" && req.url?.startsWith("/api/delete-asset")) {
    handleDeleteAsset(req, res);
    return;
  }
  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res);
    return;
  }
  sendJson(res, 405, { error: "Method not allowed" });
}

if (require.main === module) {
  const server = http.createServer(handleRequest);
  server.listen(PORT, "0.0.0.0", () => {
    const addresses = Object.values(os.networkInterfaces())
      .flat()
      .filter((item) => item && item.family === "IPv4" && !item.internal)
      .map((item) => `http://${item.address}:${PORT}/`);
    console.log(`AI design review server running at http://127.0.0.1:${PORT}/`);
    if (addresses.length) console.log(`LAN share: ${addresses.join("  ")}`);
  });
}

module.exports = handleRequest;
