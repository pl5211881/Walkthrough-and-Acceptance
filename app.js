const priorityLabels = {
  P0: "P0 阻断",
  P1: "P1 高优先级",
  P2: "P2 普通",
  P3: "P3 可优化",
};

const typeLabels = {
  Layout: "布局结构",
  Visual: "视觉样式",
  Copy: "文案内容",
  State: "组件状态",
  Interaction: "交互行为",
  Accessibility: "可用性",
};

const statusLabels = {
  ai_pending: "AI 待确认",
  ui_confirmed: "UI 已确认",
  fe_todo: "待 FE 修复",
  fe_done: "FE 已完成",
  ui_passed: "UI 复核通过",
  ui_rejected: "UI 退回",
  archived: "已归档",
  false_positive: "误报",
  accepted_deviation: "接受偏差",
};

const STORAGE_KEY = "designReviewWorkspace";
const ASSET_DB_NAME = "designReviewAssets";
const ASSET_STORE_NAME = "assets";
const ASSET_DB_VERSION = 1;
const DEFAULT_DESIGN_IMAGE = "assets/design-reference.png";
const DEFAULT_IMPLEMENTATION_IMAGE = "assets/implementation-target.png";
const SERVER_ORIGIN = window.location.protocol === "file:" ? "http://127.0.0.1:4175" : "";
const AI_REVIEW_PROXY_URL = `${SERVER_ORIGIN}/api/ai-review`;
const AI_VISION_TEST_URL = `${SERVER_ORIGIN}/api/test-vision`;
const WORKSPACE_API_URL = `${SERVER_ORIGIN}/api/workspace`;
const UPLOAD_ASSET_API_URL = `${SERVER_ORIGIN}/api/upload-asset`;
const DELETE_ASSET_API_URL = `${SERVER_ORIGIN}/api/delete-asset`;

const seedFindings = [
  {
    id: "F-001",
    title: "调试浮层覆盖页面内容",
    priority: "P0",
    severity: "Critical",
    type: "Visual",
    area: "页面右下 / 医生案例与底部操作区",
    ai_confidence: 0.98,
    workflow_status: "ai_pending",
    assignee_fe: "前端负责人",
    reviewer_ui: "设计负责人",
    figma_url: "https://www.figma.com/design/OFkfovefTyoUApmdB6aRPI?node-id=990-4081",
    figma_node_id: "990:4081",
    archive_reason: "",
    annotations: [
      { target: "design", bbox: [72, 78, 20, 9], label: "P0-01", created_by: "AI", updated_at: "17:28" },
      { target: "implementation", bbox: [72, 78, 24, 9], label: "P0-01", created_by: "AI", updated_at: "17:28" },
    ],
    observed: "实现截图右下方出现绿色 sConsole 浮层，覆盖医生案例标题右侧和底部 CTA 上方区域。",
    expected: "设计稿中没有任何调试工具或开发浮层，页面应只展示业务 UI。",
    recommendation: "在生产/验收环境关闭 sConsole 或调试插件注入，确保发布包不包含开发工具浮层。",
    comments: [{ author: "AI", content: "该问题置信度高，建议作为发布阻断项处理。" }],
  },
  {
    id: "F-002",
    title: "顶部医生头像与 Ai 助理入口缺失",
    priority: "P1",
    severity: "High",
    type: "Layout",
    area: "首屏医生信息区",
    ai_confidence: 0.91,
    workflow_status: "ai_pending",
    assignee_fe: "页面负责人",
    reviewer_ui: "设计负责人",
    figma_url: "",
    figma_node_id: "",
    archive_reason: "",
    annotations: [
      { target: "design", bbox: [66, 27, 28, 8], label: "P1-02", created_by: "AI", updated_at: "17:28" },
      { target: "implementation", bbox: [62, 24, 28, 8], label: "P1-02", created_by: "AI", updated_at: "17:28" },
    ],
    observed: "实现中医生人像整体位置更低，右侧未出现设计稿中的青色渐变 Ai 助理按钮。",
    expected: "设计稿中医生人像在右侧形成首屏视觉重心，并在胸前右侧有明显 Ai 助理入口。",
    recommendation: "恢复医生图片尺寸、定位和裁切；补齐 Ai 助理按钮并放置在医生人像右下区域。",
    comments: [],
  },
  {
    id: "F-003",
    title: "社媒/权威入口模块结构错误",
    priority: "P1",
    severity: "High",
    type: "Layout",
    area: "医生信息下方入口卡片",
    ai_confidence: 0.94,
    workflow_status: "ai_pending",
    assignee_fe: "组件负责人",
    reviewer_ui: "设计负责人",
    figma_url: "",
    figma_node_id: "",
    archive_reason: "",
    annotations: [
      { target: "design", bbox: [3, 45, 94, 8], label: "P1-03", created_by: "AI", updated_at: "17:28" },
      { target: "implementation", bbox: [3, 51, 94, 7], label: "P1-03", created_by: "AI", updated_at: "17:28" },
    ],
    observed: "实现中为白色圆角卡片，展示百度百科和百家号两个入口。",
    expected: "设计稿为深青色半透明横向容器，展示百家号、抖音号、小红书三个入口。",
    recommendation: "替换当前白色入口卡片结构，恢复三列社媒入口；缺少平台数据时使用设计确认过的降级规则。",
    comments: [],
  },
  {
    id: "F-004",
    title: "Tab 区域栏目与数据不符合设计",
    priority: "P1",
    severity: "High",
    type: "Copy",
    area: "白色内容区顶部 Tab",
    ai_confidence: 0.93,
    workflow_status: "ai_pending",
    assignee_fe: "页面负责人",
    reviewer_ui: "设计负责人",
    figma_url: "",
    figma_node_id: "",
    archive_reason: "",
    annotations: [
      { target: "design", bbox: [0, 53, 100, 11], label: "P1-04", created_by: "AI", updated_at: "17:28" },
      { target: "implementation", bbox: [0, 59, 100, 9], label: "P1-04", created_by: "AI", updated_at: "17:28" },
    ],
    observed: "实现中 Tab 为相关服务、医生案例、用户评价、变美科，并展示 5条、暂无评分、615条等数据。",
    expected: "设计稿为相关服务、患友评价、健康科普，对应年2358单、5.0分、1.1万条。",
    recommendation: "按设计稿恢复 Tab 数量、顺序、命名与统计信息；如业务字段变更，需要同步更新设计稿。",
    comments: [],
  },
  {
    id: "F-005",
    title: "在线咨询卡片内容与价格信息缺失",
    priority: "P0",
    severity: "High",
    type: "Layout",
    area: "在线咨询卡片",
    ai_confidence: 0.95,
    workflow_status: "ai_pending",
    assignee_fe: "页面负责人",
    reviewer_ui: "设计负责人",
    figma_url: "",
    figma_node_id: "",
    archive_reason: "",
    annotations: [
      { target: "design", bbox: [3, 64, 94, 18], label: "P0-05", created_by: "AI", updated_at: "17:28" },
      { target: "implementation", bbox: [3, 66, 94, 15], label: "P0-05", created_by: "AI", updated_at: "17:28" },
    ],
    observed: "实现展示年接诊量暂无、平均响应暂无、评分暂无，且没有价格信息。",
    expected: "设计稿展示月咨询 192、平均响应 30分钟内、现价 ¥210、去咨询按钮。",
    recommendation: "恢复咨询卡片的信息结构、图标、价格区和按钮布局；移除非设计稿要求的贴图。",
    comments: [],
  },
  {
    id: "F-006",
    title: "医生案例内容样式错误",
    priority: "P1",
    severity: "High",
    type: "Visual",
    area: "医生案例模块",
    ai_confidence: 0.86,
    workflow_status: "ai_pending",
    assignee_fe: "组件负责人",
    reviewer_ui: "设计负责人",
    figma_url: "",
    figma_node_id: "",
    archive_reason: "",
    annotations: [
      { target: "design", bbox: [2, 82, 96, 14], label: "P1-06", created_by: "AI", updated_at: "17:28" },
      { target: "implementation", bbox: [2, 83, 96, 10], label: "P1-06", created_by: "AI", updated_at: "17:28" },
    ],
    observed: "实现底部露出紫色卡片样式内容，并被底部栏和调试浮层遮挡。",
    expected: "设计稿中医生案例下方为横向案例图片流，展示真人局部对比图。",
    recommendation: "按设计稿恢复图片型案例列表，确认图片比例、圆角、横向间距和底部栏遮挡策略。",
    comments: [],
  },
  {
    id: "F-007",
    title: "底部固定操作栏状态与 CTA 文案不一致",
    priority: "P2",
    severity: "Medium",
    type: "Copy",
    area: "底部固定操作栏",
    ai_confidence: 0.89,
    workflow_status: "ai_pending",
    assignee_fe: "页面负责人",
    reviewer_ui: "体验负责人",
    figma_url: "",
    figma_node_id: "",
    archive_reason: "",
    annotations: [
      { target: "design", bbox: [0, 90, 100, 8], label: "P2-07", created_by: "AI", updated_at: "17:28" },
      { target: "implementation", bbox: [0, 90, 100, 8], label: "P2-07", created_by: "AI", updated_at: "17:28" },
    ],
    observed: "实现底部左侧为关注，主按钮为免费咨询。",
    expected: "设计稿左侧为已关注，主按钮为去问诊。",
    recommendation: "同步底部栏状态字段与设计稿；主按钮文案改为去问诊，除非产品确认当前场景应使用免费咨询。",
    comments: [],
  },
  {
    id: "F-008",
    title: "认证品牌与医生数据字段不一致",
    priority: "P3",
    severity: "Medium",
    type: "Copy",
    area: "医生基础信息区",
    ai_confidence: 0.72,
    workflow_status: "ai_pending",
    assignee_fe: "前端负责人",
    reviewer_ui: "体验负责人",
    figma_url: "",
    figma_node_id: "",
    archive_reason: "",
    annotations: [
      { target: "design", bbox: [3, 25, 55, 18], label: "P3-08", created_by: "AI", updated_at: "17:28" },
      { target: "implementation", bbox: [3, 26, 55, 18], label: "P3-08", created_by: "AI", updated_at: "17:28" },
    ],
    observed: "实现中认证品牌、服务人次、执业认证尾号等与设计稿不同。",
    expected: "验收截图应与设计稿保持同一数据状态，或明确说明使用真实数据替换设计样例数据。",
    recommendation: "走查环境使用与设计稿一致的 mock 数据；若接真实数据，请将该类差异配置为可接受数据偏差。",
    comments: [],
  },
];

seedFindings.forEach((item) => {
  item.source = item.source || "ai";
});

let findings = [];

function cloneFindings(source = seedFindings) {
  return JSON.parse(JSON.stringify(source)).map((item) => ({ ...item, source: item.source || "ai" }));
}

function isUneditedSeedFindings(candidate = []) {
  if (!Array.isArray(candidate) || candidate.length !== seedFindings.length) return false;
  return candidate.every((item, index) => {
    const seed = seedFindings[index];
    return item.id === seed.id
      && item.title === seed.title
      && item.workflow_status === seed.workflow_status
      && item.priority === seed.priority
      && item.ai_confidence === seed.ai_confidence
      && (item.source || "ai") === "ai"
      && JSON.stringify(item.annotations || []) === JSON.stringify(seed.annotations || []);
  });
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const assetCache = new Map();
let assetDbPromise = null;

function openAssetDb() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("当前浏览器不支持 IndexedDB"));
  if (assetDbPromise) return assetDbPromise;
  assetDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(ASSET_DB_NAME, ASSET_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ASSET_STORE_NAME)) {
        db.createObjectStore(ASSET_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("IndexedDB 打开失败"));
  });
  return assetDbPromise;
}

async function putAsset(id, dataUrl) {
  assetCache.set(id, dataUrl);
  const db = await openAssetDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE_NAME, "readwrite");
    tx.objectStore(ASSET_STORE_NAME).put({ id, dataUrl, updatedAt: new Date().toISOString() });
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error || new Error("图片保存失败"));
  });
}

async function getAsset(id) {
  if (!id) return "";
  if (assetCache.has(id)) return assetCache.get(id);
  const db = await openAssetDb();
  const record = await new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE_NAME, "readonly");
    const request = tx.objectStore(ASSET_STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error || new Error("图片读取失败"));
  });
  const dataUrl = record?.dataUrl || "";
  if (dataUrl) assetCache.set(id, dataUrl);
  return dataUrl;
}

async function deleteAsset(id) {
  if (!id) return;
  assetCache.delete(id);
  const db = await openAssetDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE_NAME, "readwrite");
    tx.objectStore(ASSET_STORE_NAME).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error || new Error("图片删除失败"));
  });
}

async function uploadAssetToServer({ id, dataUrl, filename }) {
  if (state.collaborationDisabled) {
    const error = new Error("当前环境仅支持本地草稿保存");
    error.localOnly = true;
    throw error;
  }
  const response = await fetch(UPLOAD_ASSET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, dataUrl, filename }),
  });
  const data = await readJsonResponse(response);
  if (data.localOnly || data.storageMode === "local-only") {
    state.collaborationDisabled = true;
    const error = new Error(data.error || "当前环境仅支持本地草稿保存");
    error.localOnly = true;
    throw error;
  }
  if (!data.ok || !data.url) throw new Error(data.error || "图片上传失败");
  assetCache.set(data.assetId, dataUrl);
  assetCache.set(data.url, dataUrl);
  return data;
}

async function deleteAssetFromServer(assetId) {
  if (!assetId) return;
  try {
    await fetch(DELETE_ASSET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId }),
    });
  } catch {
    // 删除远端图片失败不阻断页面继续使用，workspace 清引用即可。
  }
}

async function urlToDataUrl(url) {
  if (!url) return "";
  if (url.startsWith("data:")) return url;
  const resolvedUrl = resolveAssetUrl(url);
  if (assetCache.has(resolvedUrl)) return assetCache.get(resolvedUrl);
  const response = await fetch(resolvedUrl);
  if (!response.ok) throw new Error("图片读取失败");
  const blob = await response.blob();
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("图片读取失败"));
    reader.readAsDataURL(blob);
  });
  assetCache.set(resolvedUrl, dataUrl);
  return dataUrl;
}

function resolveAssetUrl(url = "") {
  if (!url || url.startsWith("data:") || /^https?:\/\//i.test(url)) return url;
  if (SERVER_ORIGIN && url.startsWith("/")) return `${SERVER_ORIGIN}${url}`;
  return url;
}

function pageAssetId(page, kind) {
  return kind === "design" ? page?.designImageAssetId : page?.implementationImageAssetId;
}

function pageAssetData(page, kind) {
  const url = kind === "design" ? page?.designImageUrl : page?.implementationImageUrl;
  return resolveAssetUrl(url) || assetCache.get(pageAssetId(page, kind)) || "";
}

async function pageAssetDataUrl(page, kind) {
  const url = kind === "design" ? page?.designImageUrl : page?.implementationImageUrl;
  if (url) return urlToDataUrl(url);
  return getAsset(pageAssetId(page, kind));
}

function pageHasDesignAsset(page) {
  return Boolean(page?.designImageUrl || page?.designImageAssetId);
}

function pageHasImplementationAsset(page) {
  return Boolean(page?.implementationImageUrl || page?.implementationImageAssetId);
}

function createDefaultWorkspace() {
  return {
    view: "dashboard",
    currentProjectId: "",
    currentPageId: "",
    apiConfigModalOpen: false,
    apiConfig: {
      provider: "openai",
      baseUrl: "https://api.openai.com/v1",
      model: "",
      apiKey: "",
      showKey: false,
      testedAt: "",
      status: "未配置",
    },
    projects: [],
  };
}

function isLegacyTemplateProject(project, projectIndex) {
  return projectIndex === 0
    && (project.name === "星选联盟医生详情页核验" || project.description === "设计稿与开发截图走查验收项目。");
}

function normalizeLegacyTemplate(project, projectIndex) {
  if (!isLegacyTemplateProject(project, projectIndex)) return project;
  const normalized = { ...project };
  normalized.name = "未命名走查项目";
  normalized.description = "";
  normalized.deviceSize = "414×896";
  normalized.pages = (project.pages || []).map((page, pageIndex) => ({
    ...page,
    name: pageIndex === 0 ? "未命名页面" : page.name,
    deviceSize: page.deviceSize === "iPhone XR Max · 414×896" ? "414×896" : page.deviceSize,
    figmaUrl: page.figmaUrl?.includes("OFkfovefTyoUApmdB6aRPI") ? "" : page.figmaUrl,
    implementationUrl: page.implementationUrl === DEFAULT_IMPLEMENTATION_IMAGE ? "" : page.implementationUrl,
    findings: [],
  }));
  return normalized;
}

function pageHasContent(page) {
  return Boolean(
    page.designImageAssetId
    || page.implementationImageAssetId
    || page.designImageUrl
    || page.implementationImageUrl
    || page.designImageDataUrl
    || page.implementationImageDataUrl
    || page.figmaUrl
    || page.implementationUrl
    || page.findings?.length
  );
}

function normalizeWorkspace(input) {
  const fallback = createDefaultWorkspace();
  if (!input || !Array.isArray(input.projects)) return fallback;
  const workspace = { ...fallback, ...input };
  workspace.view = ["dashboard", "upload", "review"].includes(input.view) ? input.view : "dashboard";
  workspace.apiConfig = { ...fallback.apiConfig, ...(input.apiConfig || {}) };
  workspace.apiConfigModalOpen = Boolean(input.apiConfigModalOpen);
  if (!input.projects.length) {
    workspace.projects = [];
    workspace.currentProjectId = "";
    workspace.currentPageId = "";
    workspace.view = "dashboard";
    return workspace;
  }
  const pageDefaults = {
    id: "",
    name: "未命名页面",
    deviceSize: "414×896",
    figmaUrl: "",
    implementationUrl: "",
    designImageAssetId: "",
    implementationImageAssetId: "",
    designImageUrl: "",
    implementationImageUrl: "",
    designImageDataUrl: "",
    designEmbedUrl: "",
    implementationImageDataUrl: "",
    designFileName: "",
    implementationFileName: "",
    designUpdatedAt: "",
    implementationUpdatedAt: "",
    findings: [],
    updatedAt: new Date().toLocaleString("zh-CN"),
  };
  const projectDefaults = {
    id: "",
    name: "未命名走查项目",
    description: "",
    deviceSize: "414×896",
    updatedAt: new Date().toLocaleString("zh-CN"),
    pages: [],
  };
  workspace.projects = input.projects.map((rawProject, projectIndex) => {
    const project = normalizeLegacyTemplate(rawProject, projectIndex);
    let pages = Array.isArray(project.pages) && project.pages.length
      ? project.pages.map((page, pageIndex) => ({
        ...pageDefaults,
        ...page,
        id: page.id || uid("page"),
        name: pageIndex === 0 && page.name === "页面 1" ? "未命名页面" : page.name,
        findings: isUneditedSeedFindings(page.findings) ? [] : (Array.isArray(page.findings) ? page.findings : []),
      }))
      : [{ ...pageDefaults, id: uid("page"), findings: [] }];
    if (project.name === "未命名走查项目" && pages.length > 1 && pages.every((page) => !pageHasContent(page))) {
      pages = [{ ...pages[0], name: "未命名页面" }];
    }
    return {
      ...projectDefaults,
      ...project,
      id: project.id || uid("project"),
      pages,
    };
  });
  if (!workspace.projects.some((project) => project.id === workspace.currentProjectId)) {
    workspace.currentProjectId = workspace.projects[0].id;
  }
  if (!currentProjectFrom(workspace).pages.some((page) => page.id === workspace.currentPageId)) {
    workspace.currentPageId = currentProjectFrom(workspace).pages[0].id;
  }
  return workspace;
}

function loadWorkspace() {
  try {
    return normalizeWorkspace(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
  } catch {
    return createDefaultWorkspace();
  }
}

function currentProjectFrom(workspace) {
  return workspace.projects.find((project) => project.id === workspace.currentProjectId) || workspace.projects[0] || null;
}

let workspaceState = loadWorkspace();

function applyShareHash() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const projectId = params.get("project");
  const pageId = params.get("page");
  if (!projectId || !pageId) return;
  const project = workspaceState.projects.find((item) => item.id === projectId);
  if (!project?.pages?.some((page) => page.id === pageId)) return;
  workspaceState.currentProjectId = projectId;
  workspaceState.currentPageId = pageId;
  workspaceState.view = "review";
}

function stripInlineAssetsFromWorkspace() {
  return stripInlineAssetsFrom(workspaceState);
}

function readJsonResponse(response) {
  return response.text().then((text) => {
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: text };
    }
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    return data;
  });
}

function persistLocalWorkspace(workspace = workspaceState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stripInlineAssetsFrom(workspace)));
}

function stripInlineAssetsFrom(workspace) {
  const lightweight = JSON.parse(JSON.stringify(workspace));
  lightweight.projects?.forEach((project) => {
    project.pages?.forEach((page) => {
      page.designImageDataUrl = "";
      page.implementationImageDataUrl = "";
    });
  });
  return lightweight;
}

async function loadServerWorkspace() {
  const response = await fetch(WORKSPACE_API_URL, { cache: "no-store" });
  const data = await readJsonResponse(response);
  if (data.storageMode === "local-only") state.collaborationDisabled = true;
  return data.workspace || null;
}

async function saveServerWorkspace(workspace) {
  const response = await fetch(WORKSPACE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workspace: stripInlineAssetsFrom(workspace) }),
  });
  const data = await readJsonResponse(response);
  if (data.localOnly || data.storageMode === "local-only") state.collaborationDisabled = true;
  return data;
}

async function hydrateWorkspaceFromServer() {
  try {
    const serverWorkspace = await loadServerWorkspace();
    const localWorkspace = loadWorkspace();
    if (serverWorkspace?.projects?.length) {
      workspaceState = normalizeWorkspace(serverWorkspace);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stripInlineAssetsFrom(workspaceState)));
      return;
    }
    if (localWorkspace.projects.length) {
      workspaceState = normalizeWorkspace(localWorkspace);
      const saved = await saveServerWorkspace(workspaceState);
      if (saved?.localOnly) {
        showCollaborationNotice(saved.error || "当前环境仅支持本地草稿保存");
      } else {
        toast("已将本机项目迁移到协作后端");
      }
      return;
    }
    workspaceState = createDefaultWorkspace();
  } catch (error) {
    console.warn("协作后端不可用，继续使用本地草稿。", error);
    state.collaborationDisabled = true;
    workspaceState = loadWorkspace();
    showCollaborationNotice("协作后端暂不可用，当前使用本地草稿");
  }
}

async function migrateInlineAssetsToIndexedDb() {
  const migrationJobs = [];
  workspaceState.projects.forEach((project) => {
    project.pages?.forEach((page) => {
      if (page.designImageDataUrl) {
        const id = page.designImageAssetId || uid("asset-design");
        page.designImageAssetId = id;
        migrationJobs.push(putAsset(id, page.designImageDataUrl));
        page.designImageDataUrl = "";
      }
      if (page.implementationImageDataUrl) {
        const id = page.implementationImageAssetId || uid("asset-implementation");
        page.implementationImageAssetId = id;
        migrationJobs.push(putAsset(id, page.implementationImageDataUrl));
        page.implementationImageDataUrl = "";
      }
    });
  });
  if (!migrationJobs.length) return;
  try {
    await Promise.all(migrationJobs);
    saveWorkspace({ silent: true });
  } catch {
    toast("图片迁移到 IndexedDB 失败，请重新上传图片");
  }
}

async function hydratePageAssets() {
  const pages = workspaceState.projects.flatMap((project) => project.pages || []);
  const ids = pages.flatMap((page) => [page.designImageAssetId, page.implementationImageAssetId]).filter(Boolean);
  if (!ids.length) return;
  try {
    await Promise.all(ids.map((id) => getAsset(id)));
    render();
  } catch {
    toast("图片缓存读取失败，请重新上传图片");
  }
}

const state = {
  selectedId: "",
  filter: "all",
  view: "side",
  overlayOpacity: 55,
  overlayOffsetX: 0,
  overlayOffsetY: 0,
  drag: null,
  annotationTarget: "implementation",
  overlayDrag: null,
  selection: null,
  pendingManualSelection: null,
  selectionDrag: null,
  manualMode: false,
  undoStack: [],
  redoStack: [],
  editSnapshot: null,
  lastUndoLabel: "",
  lastRedoLabel: "",
  manualDraft: {
    priority: "P2",
    type: "Layout",
    assignee_fe: "前端负责人",
    reviewer_ui: "设计负责人",
    title: "",
    detail: "",
  },
  collaborationDisabled: false,
  collaborationNoticeShown: false,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function selectedOptionLabel(select) {
  return select.options[select.selectedIndex]?.textContent || "";
}

function syncCustomSelect(select) {
  const wrapper = select.closest(".custom-select");
  if (!wrapper) return;
  const value = selectedOptionLabel(select);
  wrapper.querySelector(".custom-select-value").textContent = value;
  wrapper.querySelectorAll(".custom-select-option").forEach((option) => {
    const active = option.dataset.value === select.value;
    option.classList.toggle("active", active);
    option.setAttribute("aria-selected", active ? "true" : "false");
  });
}

function closeCustomSelects(except = null) {
  $$(".custom-select.open").forEach((item) => {
    if (item !== except) item.classList.remove("open");
  });
}

function buildCustomSelects() {
  $$("select").forEach((select) => {
    if (select.closest(".custom-select")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";
    const trigger = document.createElement("button");
    trigger.className = "custom-select-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.innerHTML = `<span class="custom-select-value"></span><span class="custom-select-icon" aria-hidden="true"></span>`;
    const menu = document.createElement("div");
    menu.className = "custom-select-menu";
    menu.setAttribute("role", "listbox");
    [...select.options].forEach((option) => {
      const item = document.createElement("button");
      item.className = "custom-select-option";
      item.type = "button";
      item.dataset.value = option.value;
      item.setAttribute("role", "option");
      item.innerHTML = `<span>${option.textContent}</span><span class="custom-select-check" aria-hidden="true">✓</span>`;
      item.addEventListener("click", () => {
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        wrapper.classList.remove("open");
      });
      menu.appendChild(item);
    });
    select.parentNode.insertBefore(wrapper, select);
    wrapper.append(select, trigger, menu);
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const nextOpen = !wrapper.classList.contains("open");
      closeCustomSelects(wrapper);
      wrapper.classList.toggle("open", nextOpen);
    });
    syncCustomSelect(select);
  });
}

function syncCustomSelects() {
  $$("select").forEach(syncCustomSelect);
}

function currentProject() {
  return currentProjectFrom(workspaceState);
}

function currentPage() {
  const project = currentProject();
  if (!project) return null;
  return project.pages.find((page) => page.id === workspaceState.currentPageId) || project.pages[0] || null;
}

function bindCurrentFindings() {
  const page = currentPage();
  if (!page) {
    findings = [];
    state.selectedId = "";
    return;
  }
  if (!Array.isArray(page.findings)) page.findings = [];
  findings = page.findings;
  if (!findings.length) {
    page.findings = cloneFindings([]);
    findings = page.findings;
  }
  if (state.manualMode) {
    if (!findings.some((item) => item.id === state.selectedId)) state.selectedId = "";
    return;
  }
  if (!state.selectedId || !findings.some((item) => item.id === state.selectedId)) {
    state.selectedId = findings[0]?.id || "";
  }
}

let saveTimer = null;
let saveInFlight = false;
let pendingSave = false;

function saveWorkspace(options = {}) {
  const project = currentProject();
  const page = currentPage();
  if (project) project.updatedAt = new Date().toLocaleString("zh-CN");
  if (page) page.updatedAt = new Date().toLocaleString("zh-CN");
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stripInlineAssetsFromWorkspace()));
  } catch {
    if (!options.silent) toast("项目数据保存失败，请删除部分页面或问题后重试");
  }
  if (options.localOnly || state.collaborationDisabled) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveWorkspaceNow(options).catch((error) => {
      console.warn("协作后端保存失败", error);
      state.collaborationDisabled = true;
      if (!options.silent) showCollaborationNotice("协作保存不可用，已保留本地草稿");
    });
  }, options.immediate ? 0 : 350);
}

async function saveWorkspaceNow(options = {}) {
  if (saveInFlight) {
    pendingSave = true;
    return;
  }
  saveInFlight = true;
  try {
    const data = await saveServerWorkspace(workspaceState);
    if (data?.localOnly) {
      showCollaborationNotice(data.error || "当前环境仅支持本地草稿保存");
    }
  } finally {
    saveInFlight = false;
  }
  if (pendingSave) {
    pendingSave = false;
    await saveWorkspaceNow({ ...options, silent: true });
  }
}

function showCollaborationNotice(message) {
  if (state.collaborationNoticeShown) return;
  state.collaborationNoticeShown = true;
  toast(message);
}

function uploadMeta(fileName, updatedAt) {
  return fileName ? `${fileName} · ${updatedAt || "刚刚"}` : "未上传";
}

function figmaEmbedUrl(url) {
  if (!url) return "";
  return `https://www.figma.com/embed?embed_host=design-review&url=${encodeURIComponent(url)}`;
}

async function fetchFigmaThumbnail(url) {
  const response = await fetch(`https://www.figma.com/api/oembed?url=${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error("Figma oEmbed 请求失败");
  const data = await response.json();
  return data.thumbnail_url || "";
}

function renderAssetPreview(kind, dataUrl, embedUrl = "", hasStoredAsset = Boolean(dataUrl)) {
  const isDesign = kind === "design";
  const preview = $(isDesign ? "#designUploadPreview" : "#implementationUploadPreview");
  const image = $(isDesign ? "#designUploadPreviewImage" : "#implementationUploadPreviewImage");
  const frame = isDesign ? $("#designUploadPreviewFrame") : null;
  const input = $(isDesign ? "#designUploadInput" : "#implementationUploadInput");
  const button = input.closest(".upload-button");
  const hasAsset = Boolean(hasStoredAsset || embedUrl);
  preview.classList.toggle("hidden", !hasAsset);
  button.classList.toggle("hidden", hasAsset);
  image.classList.toggle("hidden", !dataUrl);
  if (frame) {
    frame.classList.toggle("hidden", Boolean(dataUrl) || !embedUrl);
    if (embedUrl && frame.src !== embedUrl) frame.src = embedUrl;
    if (!embedUrl) frame.removeAttribute("src");
  }
  if (dataUrl) image.src = dataUrl;
  if (!dataUrl) image.removeAttribute("src");
}

async function applyFigmaDesignPreview(page, url) {
  if (!page || !url) return;
  try {
    const thumbnailUrl = await fetchFigmaThumbnail(url);
    if (!thumbnailUrl) throw new Error("Figma 未返回缩略图");
    if (currentPage()?.id !== page.id || page.figmaUrl !== url) return;
    const oldAssetId = page.designImageAssetId;
    const assetId = uid("asset-design");
    await putAsset(assetId, thumbnailUrl);
    if (oldAssetId) deleteAsset(oldAssetId).catch(() => {});
    page.designImageAssetId = assetId;
    page.designImageDataUrl = "";
    page.designEmbedUrl = "";
    page.designFileName = "Figma 缩略图";
    page.designUpdatedAt = new Date().toLocaleString("zh-CN");
    render();
    toast("已抓取 Figma 缩略图");
  } catch {
    toast("未能抓取 Figma 缩略图，请确认链接可公开访问或已授权");
  }
}

function projectMetrics(project) {
  const pages = Array.isArray(project.pages) ? project.pages : [];
  const pageCount = pages.length;
  const uploadedPageCount = pages.filter((page) => pageHasDesignAsset(page) && pageHasImplementationAsset(page)).length;
  const findingCount = pages.reduce((sum, page) => sum + (page.findings?.length || 0), 0);
  const archivedCount = pages.reduce((sum, page) => (
    sum + (page.findings || []).filter((item) => item.workflow_status === "archived").length
  ), 0);
  const completionPercent = findingCount ? Math.round((archivedCount / findingCount) * 100) : 0;
  return { pageCount, uploadedPageCount, findingCount, archivedCount, completionPercent };
}

function projectOutcomeMetrics(project) {
  const pages = Array.isArray(project.pages) ? project.pages : [];
  const findings = pages.flatMap((page) => page.findings || []);
  const reviewedPages = pages.filter((page) => page.findings?.length).length;
  const archivedCount = findings.filter((item) => item.workflow_status === "archived").length;
  const blockingCount = findings.filter((item) => ["P0", "P1"].includes(item.priority) && !["archived", "false_positive", "accepted_deviation"].includes(item.workflow_status)).length;
  const todoCount = findings.filter((item) => ["ai_pending", "ui_confirmed", "fe_todo"].includes(item.workflow_status)).length;
  const recheckCount = findings.filter((item) => ["fe_done", "ui_rejected"].includes(item.workflow_status)).length;
  const notStartedCount = Math.max(0, pages.length - reviewedPages);
  const validFindingCount = findings.filter((item) => !["false_positive", "accepted_deviation"].includes(item.workflow_status)).length;
  const completionPercent = validFindingCount ? Math.round((archivedCount / validFindingCount) * 100) : 0;
  const statusTotal = validFindingCount + notStartedCount || 1;
  return {
    reviewedPages,
    pageCount: pages.length,
    findingCount: findings.length,
    blockingCount,
    archivedCount,
    todoCount,
    recheckCount,
    notStartedCount,
    validFindingCount,
    completionPercent,
    rows: [
      { label: "待开始", value: notStartedCount, color: "#94a3b8" },
      { label: "待修复", value: todoCount, color: "#f59e0b" },
      { label: "待复核", value: recheckCount, color: "#38bdf8" },
      { label: "已归档", value: archivedCount, color: "#22c55e" },
    ].map((item) => ({
      ...item,
      percent: Math.round((item.value / statusTotal) * 100),
    })),
  };
}

function currentProjectSummary(project) {
  const metrics = projectOutcomeMetrics(project);
  if (!metrics.findingCount) {
    return "暂无走查成果，上传首个页面后开始沉淀数据。";
  }
  if (metrics.blockingCount) {
    return `已归档 ${metrics.archivedCount}/${metrics.validFindingCount} 个问题，仍有 ${metrics.blockingCount} 个阻断待处理。`;
  }
  return `已归档 ${metrics.archivedCount}/${metrics.validFindingCount} 个问题，当前无 P0/P1 阻断。`;
}

function projectStatus(project) {
  const metrics = projectOutcomeMetrics(project);
  if (!metrics.findingCount) return "待启动";
  if (metrics.validFindingCount > 0 && metrics.archivedCount >= metrics.validFindingCount) return "已完成";
  return "推进中";
}

function dashboardMetrics() {
  const total = workspaceState.projects.length || 0;
  const rows = [
    { label: "待启动", key: "pending", count: 0, tone: "muted" },
    { label: "推进中", key: "active", count: 0, tone: "blue" },
    { label: "已完成", key: "done", count: 0, tone: "green" },
  ];
  workspaceState.projects.forEach((project) => {
    const status = projectStatus(project);
    if (status === "待启动") rows[0].count += 1;
    if (status === "推进中") rows[1].count += 1;
    if (status === "已完成") rows[2].count += 1;
  });
  return rows.map((item) => ({ ...item, percent: total ? Math.round((item.count / total) * 100) : 0, total }));
}

function apiConfigLabel() {
  const config = workspaceState.apiConfig;
  if (config.status === "本地校验通过") return "配置已校验";
  return config.apiKey && config.model ? "已配置模型" : "未配置模型";
}

function renderShell() {
  const project = currentProject();
  const page = currentPage();
  if ((!project || !page) && workspaceState.view !== "dashboard") {
    workspaceState.view = "dashboard";
  }
  $("#projectDashboard").classList.toggle("hidden", workspaceState.view !== "dashboard");
  $("#uploadHome").classList.toggle("hidden", workspaceState.view !== "upload");
  $("#reviewWorkspace").classList.toggle("hidden", workspaceState.view !== "review");
  $("#apiConfigModal").classList.toggle("hidden", !workspaceState.apiConfigModalOpen);
  $("#apiConfigModal").setAttribute("aria-hidden", workspaceState.apiConfigModalOpen ? "false" : "true");
  $("#apiProviderInput").value = workspaceState.apiConfig.provider;
  $("#apiModelInput").value = workspaceState.apiConfig.model;
  $("#apiBaseUrlInput").value = workspaceState.apiConfig.baseUrl;
  $("#apiKeyInput").type = workspaceState.apiConfig.showKey ? "text" : "password";
  $("#apiKeyInput").value = workspaceState.apiConfig.apiKey;
  $("#toggleApiKey").textContent = workspaceState.apiConfig.showKey ? "隐藏" : "显示";
  $("#apiConfigState").textContent = apiConfigLabel();
  $("#apiModalState").textContent = apiConfigLabel();
  if (project && page) {
    const hasReviewFindings = Array.isArray(page.findings) && page.findings.length > 0;
    $("#homeSummary").textContent = `${project.name} · ${page.name} · ${page.deviceSize || project.deviceSize || "未设置尺寸"}`;
    $("#projectTitleInput").value = project.name;
    $("#pageNameInput").value = page.name;
    $("#pageDeviceInput").value = page.deviceSize;
    $("#pageFigmaInput").value = page.figmaUrl || "";
    $("#pageImplementationUrlInput").value = page.implementationUrl || "";
    $("#deleteCurrentPage").disabled = project.pages.length <= 1;
    $("#openCurrentPage").classList.toggle("hidden", !hasReviewFindings);
    $("#startAiReview").classList.toggle("hidden", hasReviewFindings);
    renderAssetPreview("design", pageAssetData(page, "design"), page.designEmbedUrl, pageHasDesignAsset(page));
    renderAssetPreview("implementation", pageAssetData(page, "implementation"), "", pageHasImplementationAsset(page));
  } else {
    $("#homeSummary").textContent = "请先从项目看板新建一个走查项目。";
    $("#projectTitleInput").value = "";
    $("#deleteCurrentPage").disabled = true;
    $("#openCurrentPage").classList.add("hidden");
    $("#startAiReview").classList.add("hidden");
    renderAssetPreview("design", "");
    renderAssetPreview("implementation", "");
  }
  renderDashboard();
  renderUploadPageList();
  renderWorkspaceHeader();
}

function renderDashboard() {
  const hasProjects = workspaceState.projects.length > 0;
  $("#createProjectTop").classList.toggle("hidden", !hasProjects);
  $("#dashboardEmptyCta").classList.toggle("hidden", hasProjects);
  $("#dashboardStats").innerHTML = dashboardMetrics().map((item) => `
    <article class="dashboard-stat">
      <div>
        <span>${item.label}</span>
        <strong>${item.count}<small> / 共 ${item.total} 个</small></strong>
      </div>
      <em>${item.percent}%</em>
    </article>
  `).join("");
  $("#projectTable").innerHTML = hasProjects ? `
    <div class="project-table-head">
      <span>项目名称</span>
      <span>状态</span>
      <span>页面数</span>
      <span>问题数</span>
      <span>阻断数</span>
      <span>完成度</span>
      <span>更新时间</span>
      <span>操作</span>
    </div>
    ${workspaceState.projects.map((project) => {
    const metrics = projectOutcomeMetrics(project);
    const status = projectStatus(project);
    return `
      <article class="project-table-row" data-project-id="${project.id}">
        <strong data-label="项目名称">${project.name}</strong>
        <span data-label="状态" class="table-cell"><b class="status-pill ${status === "已完成" ? "done" : status === "推进中" ? "active" : ""}">${status}</b></span>
        <span data-label="页面数" class="table-cell">${metrics.pageCount}</span>
        <span data-label="问题数" class="table-cell">${metrics.findingCount}</span>
        <span data-label="阻断数" class="table-cell">${metrics.blockingCount}</span>
        <span data-label="完成度" class="table-cell table-progress" style="--progress:${metrics.completionPercent}%"><i></i>${metrics.completionPercent}%</span>
        <span data-label="更新时间" class="table-cell">${project.updatedAt || "本地草稿"}</span>
        <div class="table-actions">
          <button type="button" data-open-project="${project.id}">进入</button>
          <button type="button" data-edit-project="${project.id}">编辑</button>
          <button type="button" data-delete-project="${project.id}">移除</button>
        </div>
      </article>
    `;
  }).join("")}
  ` : "";
}

function renderUploadPageList() {
  const project = currentProject();
  if (!project) {
    $("#uploadPageList").innerHTML = "";
    return;
  }
  const shouldShowPageList = project.pages.length > 1 || project.pages.some((page) => (
    pageHasDesignAsset(page) || pageHasImplementationAsset(page) || page.figmaUrl || page.implementationUrl
  ));
  $("#uploadPageList").innerHTML = shouldShowPageList
    ? project.pages.map((page) => `
      <button class="page-tab ${page.id === workspaceState.currentPageId ? "active" : ""}" type="button" data-select-page="${page.id}">
        ${page.name} · ${page.findings?.length || 0} 问题
      </button>
    `).join("")
    : "";
}

function renderWorkspaceHeader() {
  const project = currentProject();
  const page = currentPage();
  if (!project || !page) return;
  $("#workspaceProjectLabel").textContent = project.name;
  $("#workspaceTitle").textContent = `${page.name}核验`;
  $("#taskMeta").textContent = `${page.deviceSize} · ${page.findings?.length || 0} 条问题 · ${page.updatedAt || "本地草稿"}`;
  $("#figmaStatus").textContent = page.figmaUrl ? "Figma 节点已录入" : "未录入 Figma";
  $("#designImage").src = pageAssetData(page, "design") || DEFAULT_DESIGN_IMAGE;
  $("#implementationImage").src = pageAssetData(page, "implementation") || DEFAULT_IMPLEMENTATION_IMAGE;
  const hasPageTabs = project.pages.length > 1;
  $("#workspacePageTabs").innerHTML = hasPageTabs
    ? project.pages.map((item) => `
      <button class="page-tab ${item.id === page.id ? "active" : ""}" type="button" data-switch-page="${item.id}">
        ${item.name}
      </button>
    `).join("")
    : "";
  $(".page-switcher").classList.toggle("single-action", !hasPageTabs);
}

function selectedFinding() {
  return findings.find((item) => item.id === state.selectedId) || (!state.manualMode ? findings[0] : null) || null;
}

function sortedFindings() {
  const order = { P0: 0, P1: 1, P2: 2, P3: 3 };
  return [...findings].sort((a, b) => order[a.priority] - order[b.priority] || b.ai_confidence - a.ai_confidence);
}

function filteredFindings() {
  const sorted = sortedFindings();
  if (state.filter === "all") return sorted;
  if (state.filter === "manual") return sorted.filter((item) => item.source === "manual");
  if (state.filter === "ui_review") return sorted.filter((item) => ["fe_done", "ui_rejected"].includes(item.workflow_status));
  return sorted.filter((item) => item.workflow_status === state.filter);
}

function designAnnotation(item) {
  return item.annotations.find((annotation) => annotation.target === "design");
}

function implementationAnnotation(item) {
  return item.annotations.find((annotation) => annotation.target === "implementation");
}

function annotationForTarget(item, target = state.annotationTarget) {
  return item.annotations.find((annotation) => annotation.target === target);
}

function annotationFrame(target) {
  return target === "design" ? $("#designFrame") : $("#implementationFrame");
}

function mapBboxBetweenTargets(bbox, fromTarget, toTarget) {
  const fromFrame = annotationFrame(fromTarget).getBoundingClientRect();
  const toFrame = annotationFrame(toTarget).getBoundingClientRect();
  const fromWidth = fromFrame.width || 1;
  const fromHeight = fromFrame.height || 1;
  const toWidth = toFrame.width || fromWidth;
  const toHeight = toFrame.height || fromHeight;
  const centerXPx = ((bbox[0] + bbox[2] / 2) / 100) * fromWidth;
  const centerYPx = ((bbox[1] + bbox[3] / 2) / 100) * fromHeight;
  const widthPercent = ((bbox[2] / 100) * fromWidth / toWidth) * 100;
  const heightPercent = ((bbox[3] / 100) * fromHeight / toHeight) * 100;
  const leftPercent = (centerXPx / toWidth) * 100 - widthPercent / 2;
  const topPercent = (centerYPx / toHeight) * 100 - heightPercent / 2;
  return normalizeBbox([leftPercent, topPercent, widthPercent, heightPercent]);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeBbox(bbox) {
  const left = clamp(Number(bbox[0]) || 0, 0, 96);
  const top = clamp(Number(bbox[1]) || 0, 0, 96);
  const width = clamp(Number(bbox[2]) || 1, 1, 100 - left);
  const height = clamp(Number(bbox[3]) || 1, 1, 100 - top);
  return [left, top, width, height];
}

function normalizePriority(value = "P2") {
  const text = String(value).toUpperCase();
  if (["P0", "CRITICAL", "BLOCKER", "阻断"].some((item) => text.includes(item))) return "P0";
  if (["P1", "HIGH", "高"].some((item) => text.includes(item))) return "P1";
  if (["P3", "LOW", "低", "优化"].some((item) => text.includes(item))) return "P3";
  return "P2";
}

function normalizeFindingType(value = "Visual") {
  const text = String(value);
  if (typeLabels[text]) return text;
  if (/布局|结构|Layout/i.test(text)) return "Layout";
  if (/文案|Copy|Text/i.test(text)) return "Copy";
  if (/状态|State/i.test(text)) return "State";
  if (/交互|Interaction/i.test(text)) return "Interaction";
  if (/可用|无障碍|Accessibility/i.test(text)) return "Accessibility";
  return "Visual";
}

function normalizeAiFinding(raw = {}, index = 0) {
  const priority = normalizePriority(raw.priority || raw.severity);
  const id = raw.id || `F-${String(index + 1).padStart(3, "0")}`;
  const designBbox = normalizeBbox(raw.design_bbox || raw.designBbox || raw.bbox?.design || raw.bbox || [12, 28, 28, 10]);
  const implementationBbox = normalizeBbox(raw.implementation_bbox || raw.implementationBbox || raw.bbox?.implementation || raw.bbox || designBbox);
  return {
    id,
    title: String(raw.title || raw.summary || `AI 识别问题 ${index + 1}`).slice(0, 80),
    priority,
    severity: raw.severity || priority,
    type: normalizeFindingType(raw.type || raw.category),
    area: raw.area || raw.region || "待确认区域",
    source: "ai",
    ai_confidence: clamp(Number(raw.ai_confidence ?? raw.confidence ?? 0.72), 0, 1),
    workflow_status: "ai_pending",
    assignee_fe: raw.assignee_fe || raw.assignee || "前端负责人",
    reviewer_ui: raw.reviewer_ui || raw.reviewer || "设计负责人",
    figma_url: currentPage()?.figmaUrl || "",
    figma_node_id: "",
    archive_reason: "",
    observed: raw.observed || raw.observation || "模型识别到实现与设计存在差异，请人工核验。",
    expected: raw.expected || "请参考设计稿确认预期表现。",
    recommendation: raw.recommendation || raw.suggestion || "请根据设计稿调整实现，并在修复后复核。",
    comments: [{ author: "AI", content: raw.reason || "模型生成，请人工确认准确性。" }],
    annotations: [
      { target: "design", bbox: designBbox, label: `${priority}-${String(index + 1).padStart(2, "0")}`, created_by: "AI", updated_at: "刚刚" },
      { target: "implementation", bbox: implementationBbox, label: `${priority}-${String(index + 1).padStart(2, "0")}`, created_by: "AI", updated_at: "刚刚" },
    ],
  };
}

function extractJsonPayload(text = "") {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) throw new Error("模型未返回 JSON");
    return JSON.parse(match[0]);
  }
}

function aiReviewMessages(page, designImageDataUrl, implementationImageDataUrl) {
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
          text: `请对页面进行设计实现走查。设备尺寸：${page.deviceSize}。返回 JSON：{\"findings\":[{\"title\":\"\",\"priority\":\"P0|P1|P2|P3\",\"type\":\"Layout|Visual|Copy|State|Interaction|Accessibility\",\"area\":\"\",\"confidence\":0.8,\"observed\":\"\",\"expected\":\"\",\"recommendation\":\"\",\"design_bbox\":[0,0,10,10],\"implementation_bbox\":[0,0,10,10]}]}。只输出需要人工核验的问题，按优先级排序。`,
        },
        { type: "image_url", image_url: { url: designImageDataUrl } },
        { type: "image_url", image_url: { url: implementationImageDataUrl } },
      ],
    },
  ];
}

function aiReviewPayload(config, page, designImageDataUrl, implementationImageDataUrl, useResponseFormat = true) {
  return {
    model: config.model,
    temperature: 0.2,
    ...(useResponseFormat ? { response_format: { type: "json_object" } } : {}),
    messages: aiReviewMessages(page, designImageDataUrl, implementationImageDataUrl),
  };
}

function shouldRetryWithoutResponseFormat(status, message = "") {
  const text = String(message).toLowerCase();
  return status === 400 && (
    text.includes("response_format")
    || text.includes("json_object")
    || text.includes("unsupported")
    || text.includes("not support")
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
  if (normalized.includes("failed to fetch") || normalized.includes("cors")) {
    return "浏览器无法直连模型服务，请使用本地代理地址 http://127.0.0.1:4175/ 打开页面。";
  }
  return String(text || "模型请求失败");
}

async function readModelResponse(response) {
  const rawText = await response.text();
  let data = null;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message = data?.detail || data?.error?.message || data?.error || rawText || `HTTP ${response.status}`;
    const error = new Error(humanizeAiError(typeof message === "string" ? message : JSON.stringify(message)));
    error.status = response.status;
    error.body = rawText;
    throw error;
  }
  return data || {};
}

function modelContentFromResponse(data) {
  const content = data.content ?? data.choices?.[0]?.message?.content ?? data.output_text ?? "";
  if (Array.isArray(content)) {
    return content.map((item) => item.text || item.content || "").join("");
  }
  return String(content || "");
}

async function requestAiReviewViaProxy(config, page, designImageDataUrl, implementationImageDataUrl) {
  const response = await fetch(AI_REVIEW_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      baseUrl: config.baseUrl,
      model: config.model,
      apiKey: config.apiKey,
      provider: config.provider,
      page: {
        deviceSize: page.deviceSize,
        designImageDataUrl,
        implementationImageDataUrl,
      },
    }),
  });
  try {
    return await readModelResponse(response);
  } catch (error) {
    error.fromProxy = true;
    throw error;
  }
}

async function requestAiReviewDirect(config, page, designImageDataUrl, implementationImageDataUrl) {
  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.apiKey}`,
  };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(aiReviewPayload(config, page, designImageDataUrl, implementationImageDataUrl, true)),
    });
    return await readModelResponse(response);
  } catch (error) {
    if (!shouldRetryWithoutResponseFormat(error.status, error.message || error.body)) throw error;
    const retryResponse = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(aiReviewPayload(config, page, designImageDataUrl, implementationImageDataUrl, false)),
    });
    return readModelResponse(retryResponse);
  }
}

async function requestAiReview(config, page, designImageDataUrl, implementationImageDataUrl) {
  try {
    return await requestAiReviewViaProxy(config, page, designImageDataUrl, implementationImageDataUrl);
  } catch (proxyError) {
    if (proxyError.fromProxy && proxyError.status) {
      console.error("AI 代理返回模型错误", proxyError);
      throw proxyError;
    }
    console.warn("本地 AI 代理不可用，尝试浏览器直连模型服务。", proxyError);
    try {
      return await requestAiReviewDirect(config, page, designImageDataUrl, implementationImageDataUrl);
    } catch (directError) {
      console.error("AI 识别失败", { proxyError, directError });
      if (directError instanceof TypeError) {
        throw new Error("浏览器直连模型服务失败，请使用本地代理服务 http://127.0.0.1:4175/");
      }
      throw directError;
    }
  }
}

async function testVisionConfig(config) {
  const response = await fetch(AI_VISION_TEST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      baseUrl: config.baseUrl,
      model: config.model,
      apiKey: config.apiKey,
      provider: config.provider,
    }),
  });
  return readModelResponse(response);
}

function formatPercentValue(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function updateManualDraftFromInputs() {
  state.manualDraft = {
    priority: $("#manualPrioritySelect")?.value || "P2",
    type: $("#manualTypeSelect")?.value || "Layout",
    assignee_fe: $("#manualFeSelect")?.value || "前端负责人",
    reviewer_ui: $("#manualUiSelect")?.value || "设计负责人",
    title: $("#manualTitleInput")?.value.trim() || "",
    detail: $("#manualDetailInput")?.value.trim() || "",
  };
}

function syncManualDraftInputs() {
  if (!$("#manualPrioritySelect")) return;
  $("#manualPrioritySelect").value = state.manualDraft.priority;
  $("#manualTypeSelect").value = state.manualDraft.type;
  $("#manualFeSelect").value = state.manualDraft.assignee_fe;
  $("#manualUiSelect").value = state.manualDraft.reviewer_ui;
  $("#manualTitleInput").value = state.manualDraft.title;
  $("#manualDetailInput").value = state.manualDraft.detail;
}

function resetManualDraft() {
  state.manualDraft = {
    priority: "P2",
    type: "Layout",
    assignee_fe: "前端负责人",
    reviewer_ui: "设计负责人",
    title: "",
    detail: "",
  };
}

function exitManualCreateMode(options = {}) {
  state.manualMode = false;
  state.pendingManualSelection = null;
  state.selection = null;
  state.selectionDrag = null;
  if (options.resetDraft !== false) resetManualDraft();
}

function fillBboxInputs(bbox = [0, 0, 0, 0]) {
  $("#bboxLeftInput").value = formatPercentValue(bbox[0]);
  $("#bboxTopInput").value = formatPercentValue(bbox[1]);
  $("#bboxWidthInput").value = formatPercentValue(bbox[2]);
  $("#bboxHeightInput").value = formatPercentValue(bbox[3]);
}

function snapshotState() {
  return JSON.stringify({
    findings: JSON.parse(JSON.stringify(findings)),
    selectedId: state.selectedId,
    annotationTarget: state.annotationTarget,
  });
}

function restoreSnapshot(snapshot) {
  const parsed = JSON.parse(snapshot);
  findings.splice(0, findings.length, ...parsed.findings);
  state.selectedId = parsed.selectedId;
  state.annotationTarget = parsed.annotationTarget || "implementation";
  if (!selectedFinding()) state.selectedId = findings[0]?.id || "";
}

function pushUndo(snapshot = snapshotState(), label = "标注操作") {
  state.undoStack.push({ snapshot, label });
  state.redoStack = [];
  state.lastUndoLabel = label;
  state.lastRedoLabel = "";
  if (state.undoStack.length > 40) state.undoStack.shift();
}

function undoLastAction() {
  if (!state.undoStack.length) {
    toast("暂无可撤回操作");
    return;
  }
  const entry = state.undoStack.pop();
  state.redoStack.push({ snapshot: snapshotState(), label: entry.label });
  state.lastUndoLabel = state.undoStack.at(-1)?.label || "";
  state.lastRedoLabel = entry.label;
  restoreSnapshot(entry.snapshot);
  render();
  toast(`已撤回：${entry.label}`);
}

function redoLastAction() {
  if (!state.redoStack.length) {
    toast("暂无可重做操作");
    return;
  }
  const entry = state.redoStack.pop();
  const currentSnapshot = snapshotState();
  state.undoStack.push({ snapshot: currentSnapshot, label: entry.label });
  state.lastUndoLabel = entry.label;
  state.lastRedoLabel = state.redoStack.at(-1)?.label || "";
  restoreSnapshot(entry.snapshot);
  render();
  toast(`已重做：${entry.label}`);
}

function render() {
  bindCurrentFindings();
  renderShell();
  renderStats();
  renderIssues();
  renderCanvas();
  renderDetail();
  syncCustomSelects();
  saveWorkspace();
}

function renderStats() {
  $("#pendingCount").textContent = findings.filter((item) => item.workflow_status === "ai_pending").length;
  $("#p0Count").textContent = findings.filter((item) => item.priority === "P0" && item.workflow_status !== "archived").length;
  $("#feDoneCount").textContent = findings.filter((item) => ["fe_done", "ui_passed", "archived"].includes(item.workflow_status)).length;
  $("#archivedCount").textContent = findings.filter((item) => item.workflow_status === "archived").length;
}

function renderWorkflowStrip() {
  const item = selectedFinding();
  const branchLabels = {
    false_positive: "已标记误报",
    accepted_deviation: "已接受偏差",
    ui_rejected: "UI 已退回",
  };
  const steps = branchLabels[item.workflow_status]
    ? [
      ["ai_pending", "AI 待确认"],
      [item.workflow_status, branchLabels[item.workflow_status]],
    ]
    : [
    ["ai_pending", "AI 待确认"],
    ["ui_confirmed", "UI 已确认"],
    ["fe_todo", "待 FE 修复"],
    ["fe_done", "FE 已完成"],
    ["archived", "已归档"],
    ];
  const activeIndex = steps.findIndex(([status]) => status === item.workflow_status);
  $("#workflowStrip").innerHTML = steps.map(([status, label], index) => {
    const active = status === item.workflow_status;
    const done = activeIndex > -1 && index < activeIndex;
    return `
      <li class="workflow-step ${active ? "active" : ""} ${done ? "done" : ""}">
        <span class="workflow-dot">${index + 1}</span>
        <span class="workflow-label">${label}</span>
      </li>
    `;
  }).join("");
}

function renderIssues() {
  const items = filteredFindings();
  $("#issueList").innerHTML = items.length ? items.map((item) => `
    <article class="issue-row ${item.id === state.selectedId ? "active" : ""}" data-id="${item.id}">
      <div class="issue-main">
        <span class="priority-pill ${item.priority.toLowerCase()}">${priorityLabels[item.priority]}</span>
        ${item.source === "manual" ? `<span class="source-pill">人工标注</span>` : ""}
        <button class="issue-delete-button" type="button" data-delete-finding="${item.id}" aria-label="删除问题">删除</button>
        <strong>${item.title}</strong>
        <p>${item.area}</p>
      </div>
      <div class="issue-meta">
        <span>${Math.round(item.ai_confidence * 100)}%</span>
        <span>${item.assignee_fe}</span>
        <span>${statusLabels[item.workflow_status]}</span>
      </div>
    </article>
  `).join("") : `<div class="empty-state">当前筛选下暂无问题。</div>`;
}

function setBox(el, annotation) {
  const [left, top, width, height] = annotation.bbox;
  el.style.left = `${left}%`;
  el.style.top = `${top}%`;
  el.style.width = `${width}%`;
  el.style.height = `${height}%`;
}

function renderEvidenceLabel(label) {
  const [priority, sequence = "00"] = label.split("-");
  return `<strong>${priority}</strong>`;
}

function renderManualToolbar() {
  const item = selectedFinding();
  const shouldShowManualPanel = state.manualMode || Boolean(state.pendingManualSelection);
  $("#manualAnnotationPanel").classList.toggle("hidden", !shouldShowManualPanel);
  $(".verify-panel").classList.toggle("manual-new-mode", shouldShowManualPanel);
  $("#compareStage").classList.toggle("manual-mode", state.manualMode);
  $("#newAnnotation").classList.toggle("active", state.manualMode);
  $("#newAnnotation").textContent = state.manualMode ? "退出" : "人工";
  $$(".manual-only-tool").forEach((item) => {
    item.classList.toggle("visible", state.manualMode);
  });
  $$(".manual-confirm-tool").forEach((item) => {
    item.classList.toggle("visible", Boolean(state.pendingManualSelection));
  });
  $("#confirmManualSelection").disabled = !state.pendingManualSelection;
  $("#toolbarUndoAnnotation").disabled = !state.undoStack.length;
  $("#toolbarRedoAnnotation").disabled = !state.redoStack.length;
  $("#confirmSideAnnotation").disabled = !state.pendingManualSelection;
  $("#confirmSideAnnotation").textContent = "确认标注";
  syncManualDraftInputs();
  if (state.pendingManualSelection) {
    fillBboxInputs(state.pendingManualSelection.bbox);
    $("#annotationUpdatedAt").textContent = "预览待确认";
  }
}

function renderCanvas() {
  const item = state.manualMode ? null : selectedFinding();
  $$(".selection-box").forEach((box) => box.classList.remove("visible", "pending"));
  if (state.pendingManualSelection) {
    ["design", "implementation"].forEach((target) => {
      const pendingBox = $(`#${target}SelectionBox`);
      setBox(pendingBox, { bbox: state.pendingManualSelection.bbox });
      pendingBox.classList.add("visible", "pending");
    });
  }
  renderManualToolbar();
  if (!item) {
    $("#designBbox").style.display = "none";
    $("#implementationBbox").style.display = "none";
    $("#canvasHintText").textContent = state.manualMode
      ? state.pendingManualSelection
        ? "人工模式：两侧已自动生成同位置预览框；可拖动任一侧调整位置，确认后生成问题。"
        : "人工模式：在截图上拖拽区域，松手后先生成预览框；确认后才会新增问题。"
      : "当前页面暂无走查问题。请使用人工模式新增标注，或在接入真实模型接口后生成识别结果。";
    return;
  }
  $("#designBbox").style.display = "";
  $("#implementationBbox").style.display = "";
  const design = designAnnotation(item);
  const implementation = implementationAnnotation(item);
  $("#compareStage").classList.toggle("overlay-mode", state.view === "overlay");
  $("#compareStage").style.setProperty("--overlay-opacity", state.overlayOpacity / 100);
  $("#compareStage").style.setProperty("--overlay-offset-x", `${state.overlayOffsetX}px`);
  $("#compareStage").style.setProperty("--overlay-offset-y", `${state.overlayOffsetY}px`);
  $("#opacityControl").classList.toggle("visible", state.view === "overlay");
  $("#overlayAlignControl").classList.toggle("visible", state.view === "overlay");
  $("#overlayOpacity").value = state.overlayOpacity;
  $("#overlayValue").textContent = `${state.overlayOpacity}%`;
  $("#overlayOffsetX").value = state.overlayOffsetX;
  $("#overlayOffsetY").value = state.overlayOffsetY;
  $("#canvasHintText").textContent = "点击问题或标注点定位证据；拖动标注框可修正位置，拖右下角控制点可修改尺寸；叠图模式可拖动实现图或输入 X/Y 完成手动对齐。";
  setBox($("#designBbox"), design);
  setBox($("#implementationBbox"), implementation);
  $("#designBbox").classList.toggle("manual-source", item.source === "manual");
  $("#implementationBbox").classList.toggle("manual-source", item.source === "manual");
  $("#designBbox").classList.toggle("editing", state.annotationTarget === "design");
  $("#implementationBbox").classList.toggle("editing", state.annotationTarget === "implementation");
  $("#designLabel").innerHTML = renderEvidenceLabel(design.label);
  $("#implementationLabel").innerHTML = renderEvidenceLabel(implementation.label);
}

function renderDetail() {
  const item = selectedFinding();
  if (!item) {
    $("#detailTitle").textContent = "暂无问题";
    $("#detailPriority").textContent = "-";
    $("#workflowStrip").innerHTML = "";
    $("#nextActionTitle").textContent = "等待识别";
    $("#nextActionHint").textContent = "当前未接入真实模型识别接口，可先通过人工标注新增问题。";
    $("#primaryFlowAction").textContent = "进入人工标注";
    $("#primaryFlowAction").disabled = false;
    $("#secondaryFlowAction").hidden = true;
    $("#manualAnnotationPanel").classList.toggle("hidden", !(state.manualMode || state.pendingManualSelection));
    $(".verify-panel").classList.toggle("manual-new-mode", state.manualMode || Boolean(state.pendingManualSelection));
    syncManualDraftInputs();
    fillBboxInputs(state.pendingManualSelection?.bbox || [0, 0, 0, 0]);
    $("#annotationUpdatedAt").textContent = state.pendingManualSelection ? "预览待确认" : "待框选";
    $("#commentList").innerHTML = `<div class="comment-item">人工新建问题会在确认标注后生成评论记录。</div>`;
    return;
  }
  const annotation = annotationForTarget(item);
  renderWorkflowStrip();
  renderNextAction(item);
  $("#detailTitle").textContent = item.title;
  $("#detailPriority").textContent = item.priority;
  $("#detailPriority").className = `priority-badge ${item.priority.toLowerCase()}`;
  $("#prioritySelect").value = item.priority;
  $("#typeSelect").value = item.type;
  $("#feSelect").value = item.assignee_fe;
  $("#uiSelect").value = item.reviewer_ui;
  $("#titleInput").value = item.title;
  $("#observedText").value = item.observed;
  $("#expectedText").value = item.expected;
  $("#recommendationText").value = item.recommendation;
  $("#feDoneCheck").checked = ["fe_done", "ui_passed", "archived"].includes(item.workflow_status);
  $("#annotationUpdatedAt").textContent = `${annotation.created_by} ${annotation.updated_at}`;
  $("#bboxLeftInput").value = formatPercentValue(annotation.bbox[0]);
  $("#bboxTopInput").value = formatPercentValue(annotation.bbox[1]);
  $("#bboxWidthInput").value = formatPercentValue(annotation.bbox[2]);
  $("#bboxHeightInput").value = formatPercentValue(annotation.bbox[3]);
  $("#commentList").innerHTML = item.comments.length
    ? item.comments.map((comment, index) => `
      <div class="comment-item">
        <span><strong>${comment.author}</strong>：${comment.content}</span>
        <button type="button" data-delete-comment="${index}" aria-label="删除评论">删除</button>
      </div>
    `).join("")
    : `<div class="comment-item">暂无评论。</div>`;
  $("#undoAnnotation").disabled = !state.undoStack.length;
  $("#redoAnnotation").disabled = !state.redoStack.length;
  $("#undoCaption").textContent = state.undoStack.length
    ? `可撤回：${state.undoStack.at(-1).label}`
    : state.redoStack.length
      ? `可重做：${state.redoStack.at(-1).label}`
      : "暂无可撤回操作";
}

function nextActionFor(item) {
  if (item.workflow_status === "ai_pending") {
    return ["确认并派给 FE", "确认 AI/人工问题后，直接进入 FE 修复。", () => {
      updateSelected({ workflow_status: "fe_todo" });
      addHistory(`UI 已确认并指派给 ${selectedFinding().assignee_fe} 修复。`, "UI");
      render();
      toast("已确认并进入 FE 修复");
    }];
  }
  if (item.workflow_status === "ui_confirmed") {
    return ["进入 FE 修复", "把已确认问题转为 FE 待办。", () => $("#sendToFe").click()];
  }
  if (item.workflow_status === "fe_todo") {
    return ["标记 FE 已完成", "FE 完成后交回 UI 复核。", () => {
      updateSelected({ workflow_status: "fe_done" });
      addHistory("FE 已标记完成，等待 UI 复核。", "FE");
      render();
      toast("已标记 FE 完成");
    }];
  }
  if (item.workflow_status === "fe_done") {
    return ["UI 复核通过并归档", "确认截图已修复后归档问题。", () => $("#uiPass").click()];
  }
  if (item.workflow_status === "ui_rejected") {
    return ["等待 FE 重新修复", "UI 已退回该问题，FE 修改后可再次标记完成并提交复核。", () => $("#sendToFe").click()];
  }
  if (["archived", "false_positive", "accepted_deviation"].includes(item.workflow_status)) {
    return ["已完成，无需推进", "该问题已结束，可继续核验下一条。", null];
  }
  return ["继续核验", "按当前状态推进核验流程。", null];
}

function renderNextAction(item) {
  const [title, hint, action] = nextActionFor(item);
  const secondaryVisible = item.workflow_status === "fe_done";
  $("#nextActionTitle").textContent = title;
  $("#nextActionHint").textContent = hint;
  $("#primaryFlowAction").textContent = title;
  $("#primaryFlowAction").disabled = !action;
  $("#secondaryFlowAction").hidden = !secondaryVisible;
  $("#nextActionPanel").classList.toggle("review-focus", item.workflow_status === "fe_done");
  $("#reviewFlowCard").classList.toggle("review-focus", item.workflow_status === "fe_done");
}

function updateSelected(patch) {
  Object.assign(selectedFinding(), patch);
  render();
}

function addHistory(content, author = "系统") {
  selectedFinding().comments.push({ author, content });
}

function updateAnnotation(target, nextBbox, options = {}) {
  if (options.record) pushUndo(undefined, options.label || "调整标注");
  const annotation = annotationForTarget(selectedFinding(), target);
  annotation.bbox = normalizeBbox(nextBbox);
  annotation.updated_at = "刚刚";
  annotation.created_by = annotation.created_by === "AI" ? "AI/UI" : annotation.created_by;
  if (options.history) addHistory(options.history, "UI");
  renderCanvas();
  if (options.renderDetail !== false) renderDetail();
}

function updateAnnotationFromInputs(options = {}) {
  if (state.pendingManualSelection) {
    state.pendingManualSelection.bbox = normalizeBbox([
      $("#bboxLeftInput").value,
      $("#bboxTopInput").value,
      $("#bboxWidthInput").value,
      $("#bboxHeightInput").value,
    ]);
    if (options.commit) toast("已调整人工标注预览框");
    renderCanvas();
    return;
  }
  if (!selectedFinding()) return;
  updateAnnotation(state.annotationTarget, [
    $("#bboxLeftInput").value,
    $("#bboxTopInput").value,
    $("#bboxWidthInput").value,
    $("#bboxHeightInput").value,
  ], {
    history: options.commit ? `已精确调整${state.annotationTarget === "design" ? "设计侧" : "实现侧"}标注框。` : "",
    renderDetail: options.commit,
  });
  if (!options.commit) {
    $("#annotationUpdatedAt").textContent = `${annotationForTarget(selectedFinding()).created_by} 刚刚`;
  }
}

function confirmManualFinding() {
  if (!state.pendingManualSelection) {
    toast("请先在截图上框选标注区域");
    return;
  }
  updateManualDraftFromInputs();
  if (!state.manualDraft.title) {
    toast("请填写问题标题");
    $("#manualTitleInput").focus();
    return;
  }
  const pending = state.pendingManualSelection;
  createManualFinding(pending.target, pending.bbox, state.manualDraft);
  state.pendingManualSelection = null;
  state.manualMode = false;
  resetManualDraft();
  render();
  toast("已确认人工标注并生成新问题");
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}

function taskTableText(format = "plain") {
  const rows = sortedFindings()
    .filter((item) => !["false_positive", "accepted_deviation"].includes(item.workflow_status))
    .map((item, index) => [
      format === "feishu" ? `任务 ${index + 1}` : "",
      `${priorityLabels[item.priority]}｜${item.title}`,
      `状态：${statusLabels[item.workflow_status]}`,
      `负责人：${item.assignee_fe}`,
      `区域：${item.area}`,
      `建议：${item.recommendation}`,
    ].filter(Boolean).join("\n"));
  return rows.join("\n\n");
}

function copyText(text, successMessage) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => toast(successMessage)).catch(() => {
      downloadTextFile("协作链接.txt", text, "text/plain");
      toast("剪切板不可用，已生成链接文本");
    });
    return;
  }
  downloadTextFile("协作链接.txt", text, "text/plain");
  toast("剪切板不可用，已生成链接文本");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function safeFileName(value = "走查问题清单") {
  return String(value).replace(/[\\/:*?"<>|]/g, "-").slice(0, 80) || "走查问题清单";
}

function downloadTextFile(filename, content, type = "text/html") {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportShareHtml() {
  const project = currentProject();
  const page = currentPage();
  if (!project || !page) {
    toast("请先选择走查页面");
    return;
  }
  const [designImage, implementationImage] = await Promise.all([
    pageAssetDataUrl(page, "design").catch(() => ""),
    pageAssetDataUrl(page, "implementation").catch(() => ""),
  ]);
  const effectiveFindings = sortedFindings().filter((item) => !["false_positive"].includes(item.workflow_status));
  const rows = effectiveFindings.map((item) => `
    <article class="finding">
      <div class="finding-head">
        <span class="priority ${item.priority.toLowerCase()}">${escapeHtml(priorityLabels[item.priority])}</span>
        <span>${escapeHtml(statusLabels[item.workflow_status])}</span>
      </div>
      <h2>${escapeHtml(item.title)}</h2>
      <p class="area">${escapeHtml(item.area)}</p>
      <dl>
        <div><dt>负责人</dt><dd>${escapeHtml(item.assignee_fe)}</dd></div>
        <div><dt>问题类型</dt><dd>${escapeHtml(typeLabels[item.type] || item.type)}</dd></div>
        <div><dt>当前实现</dt><dd>${escapeHtml(item.observed)}</dd></div>
        <div><dt>设计预期</dt><dd>${escapeHtml(item.expected)}</dd></div>
        <div><dt>修复建议</dt><dd>${escapeHtml(item.recommendation)}</dd></div>
      </dl>
    </article>
  `).join("");
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(project.name)} - ${escapeHtml(page.name)}走查问题清单</title>
  <style>
    :root { color-scheme: dark; --bg:#0b0f10; --panel:#171c1e; --line:#2b3236; --text:#f4f7f8; --muted:#aab3ba; --green:#b7ff5a; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 28px; background: var(--bg); color: var(--text); font: 14px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    header { margin-bottom: 22px; }
    h1 { margin: 0 0 8px; font-size: 26px; }
    .meta { color: var(--muted); }
    .shots { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 20px 0; }
    .shot, .finding { border: 1px solid var(--line); border-radius: 14px; background: var(--panel); padding: 14px; }
    .shot img { display: block; width: 100%; max-height: 760px; object-fit: contain; border-radius: 10px; background: #050708; }
    .shot h2, .finding h2 { margin: 0 0 10px; font-size: 17px; }
    .list { display: grid; gap: 14px; }
    .finding-head { display: flex; gap: 8px; margin-bottom: 10px; color: var(--muted); }
    .priority { border-radius: 999px; padding: 2px 9px; background: rgba(183,255,90,.14); color: var(--green); font-weight: 800; }
    .area { margin: 0 0 10px; color: var(--muted); }
    dl { display: grid; gap: 8px; margin: 0; }
    dl div { display: grid; grid-template-columns: 82px minmax(0, 1fr); gap: 12px; }
    dt { color: var(--muted); font-weight: 700; }
    dd { margin: 0; }
    @media (max-width: 860px) { body { padding: 16px; } .shots { grid-template-columns: 1fr; } dl div { grid-template-columns: 1fr; gap: 2px; } }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(project.name)} / ${escapeHtml(page.name)} 走查问题清单</h1>
    <div class="meta">${escapeHtml(page.deviceSize)} · ${effectiveFindings.length} 条问题 · 导出时间 ${new Date().toLocaleString("zh-CN")}</div>
  </header>
  <section class="shots">
    <div class="shot"><h2>设计稿</h2>${designImage ? `<img src="${designImage}" alt="设计稿" />` : `<p class="meta">未包含设计稿截图</p>`}</div>
    <div class="shot"><h2>开发截图</h2>${implementationImage ? `<img src="${implementationImage}" alt="开发截图" />` : `<p class="meta">未包含开发截图</p>`}</div>
  </section>
  <section class="list">${rows || `<div class="finding">暂无可导出问题。</div>`}</section>
</body>
</html>`;
  downloadTextFile(`${safeFileName(project.name)}-${safeFileName(page.name)}-走查问题清单.html`, html);
  toast("本地 HTML 已生成，可直接发给 FE");
}

async function exportTaskTable(action = "copy") {
  if (action === "share") {
    copyText(collaborationLink(), "协作链接已复制，可发给 FE/UI 共同编辑");
    return;
  }
  if (action === "html") {
    await exportShareHtml();
    return;
  }
  if (action === "pdf") {
    window.print();
    toast("已打开打印窗口，可选择另存为 PDF");
    return;
  }
  if (action === "feishu") {
    copyText(taskTableText("feishu"), "飞书任务格式已复制");
    return;
  }
  copyText(taskTableText(), "问题清单已复制到剪切板");
}

function collaborationLink() {
  const project = currentProject();
  const page = currentPage();
  const origin = window.location.protocol === "file:" ? "http://127.0.0.1:4175" : window.location.origin;
  const path = window.location.protocol === "file:" ? "/" : window.location.pathname;
  const params = new URLSearchParams();
  if (project?.id && page?.id) {
    params.set("project", project.id);
    params.set("page", page.id);
  }
  return `${origin}${path}#${params.toString()}`;
}

function selectFinding(id) {
  exitManualCreateMode();
  state.selectedId = id;
  render();
}

function deleteFinding(id = state.selectedId) {
  if (findings.length <= 1) {
    toast("至少保留一条问题");
    return;
  }
  const index = findings.findIndex((item) => item.id === id);
  if (index < 0) return;
  const title = findings[index].title;
  pushUndo(undefined, "删除问题");
  findings.splice(index, 1);
  if (state.selectedId === id) {
    const next = findings[index] || findings[index - 1] || findings[0];
    state.selectedId = next?.id || "";
  }
  render();
  toast(`已删除问题：${title}`);
}

function switchToPage(pageId, view = workspaceState.view) {
  if (!currentProject()?.pages.some((page) => page.id === pageId)) return;
  workspaceState.currentPageId = pageId;
  workspaceState.view = view;
  state.selectedId = "";
  state.filter = "all";
  exitManualCreateMode();
  state.undoStack = [];
  state.redoStack = [];
  $$(".chip").forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  render();
}

function switchToProject(projectId) {
  const project = workspaceState.projects.find((item) => item.id === projectId);
  if (!project) return;
  workspaceState.currentProjectId = projectId;
  workspaceState.currentPageId = project.pages[0]?.id || "";
  workspaceState.view = "upload";
  state.selectedId = "";
  state.filter = "all";
  exitManualCreateMode();
  state.undoStack = [];
  state.redoStack = [];
  render();
  toast(`已切换到：${project.name}`);
}

function createBlankPage(project, name = "未命名页面") {
  return {
    id: uid("page"),
    name,
    deviceSize: project.deviceSize || "414×896",
    figmaUrl: "",
    implementationUrl: "",
    designImageAssetId: "",
    implementationImageAssetId: "",
    designImageDataUrl: "",
    designEmbedUrl: "",
    implementationImageDataUrl: "",
    designFileName: "",
    implementationFileName: "",
    designUpdatedAt: "",
    implementationUpdatedAt: "",
    findings: [],
    updatedAt: new Date().toLocaleString("zh-CN"),
  };
}

function addProject() {
  const id = uid("project");
  const project = {
    id,
    name: workspaceState.projects.length ? `未命名走查项目 ${workspaceState.projects.length + 1}` : "未命名走查项目",
    description: "",
    deviceSize: "414×896",
    updatedAt: new Date().toLocaleString("zh-CN"),
    pages: [],
  };
  project.pages.push(createBlankPage(project));
  workspaceState.projects.push(project);
  switchToProject(id);
  toast("已新增项目");
}

function deleteProject(projectId) {
  const index = workspaceState.projects.findIndex((project) => project.id === projectId);
  if (index < 0) return;
  workspaceState.projects.splice(index, 1);
  if (!workspaceState.projects.length) {
    workspaceState.currentProjectId = "";
    workspaceState.currentPageId = "";
    workspaceState.view = "dashboard";
  } else if (workspaceState.currentProjectId === projectId) {
    const next = workspaceState.projects[index] || workspaceState.projects[index - 1] || workspaceState.projects[0];
    workspaceState.currentProjectId = next.id;
    workspaceState.currentPageId = next.pages[0]?.id || "";
    workspaceState.view = "dashboard";
  }
  render();
  toast("已删除项目");
}

function addReviewPage() {
  const project = currentProject();
  if (!project) return;
  const id = uid("page");
  const page = createBlankPage(project, `未命名页面 ${project.pages.length + 1}`);
  page.id = id;
  project.pages.push(page);
  switchToPage(id, "upload");
  toast("已新增页面");
}

function deleteReviewPage(pageId) {
  const project = currentProject();
  if (project.pages.length <= 1) {
    toast("至少保留一个页面");
    return;
  }
  const index = project.pages.findIndex((page) => page.id === pageId);
  if (index < 0) return;
  project.pages.splice(index, 1);
  if (workspaceState.currentPageId === pageId) {
    workspaceState.currentPageId = project.pages[index]?.id || project.pages[index - 1]?.id || project.pages[0].id;
  }
  render();
  toast("已删除页面");
}

function syncCurrentPageInputs() {
  const page = currentPage();
  const project = currentProject();
  if (!page || !project) return;
  page.name = $("#pageNameInput").value.trim() || "未命名页面";
  page.deviceSize = $("#pageDeviceInput").value.trim() || project.deviceSize || "414×896";
  page.figmaUrl = $("#pageFigmaInput").value.trim();
  page.implementationUrl = $("#pageImplementationUrlInput").value.trim();
  render();
}

function syncApiConfigInputs() {
  workspaceState.apiConfig.provider = $("#apiProviderInput").value;
  workspaceState.apiConfig.model = $("#apiModelInput").value.trim();
  workspaceState.apiConfig.baseUrl = $("#apiBaseUrlInput").value.trim() || "https://api.openai.com/v1";
  workspaceState.apiConfig.apiKey = $("#apiKeyInput").value.trim();
}

function readUpload(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result || ""), file);
  reader.onerror = () => toast("图片读取失败，请重新选择");
  reader.readAsDataURL(file);
}

function openReviewWorkspace() {
  const page = currentPage();
  if (!page) {
    toast("请先新建走查项目");
    return;
  }
  workspaceState.view = "review";
  exitManualCreateMode();
  bindCurrentFindings();
  toast(page.findings.length ? "已进入当前页面走查" : "当前页面暂无问题，可使用人工标注新增");
  render();
}

async function startAiReview() {
  const page = currentPage();
  if (!page) {
    toast("请先新建走查项目");
    return;
  }
  syncCurrentPageInputs();
  syncApiConfigInputs();
  const config = workspaceState.apiConfig;
  if (!config.baseUrl || !config.model || !config.apiKey) {
    toast("请先完成模型配置");
    workspaceState.apiConfigModalOpen = true;
    renderShell();
    return;
  }
  if (!pageHasDesignAsset(page) || !pageHasImplementationAsset(page)) {
    toast("请先上传设计稿和开发截图");
    return;
  }
  let designImageDataUrl = "";
  let implementationImageDataUrl = "";
  try {
    [designImageDataUrl, implementationImageDataUrl] = await Promise.all([
      pageAssetDataUrl(page, "design"),
      pageAssetDataUrl(page, "implementation"),
    ]);
  } catch {
    toast("图片读取失败，请重新上传设计稿和开发截图");
    return;
  }
  if (!designImageDataUrl || !implementationImageDataUrl) {
    toast("未找到已上传图片，请重新上传设计稿和开发截图");
    return;
  }
  const button = $("#startAiReview");
  button.disabled = true;
  button.textContent = "识别中...";
  toast("正在调用模型识别走查问题");
  try {
    const data = await requestAiReview(config, page, designImageDataUrl, implementationImageDataUrl);
    const content = modelContentFromResponse(data);
    const parsed = extractJsonPayload(content);
    const rawFindings = Array.isArray(parsed) ? parsed : parsed.findings;
    if (!Array.isArray(rawFindings)) throw new Error("模型 JSON 中缺少 findings 数组");
    page.findings = rawFindings.map(normalizeAiFinding);
    page.updatedAt = new Date().toLocaleString("zh-CN");
    state.selectedId = page.findings[0]?.id || "";
    workspaceState.view = "review";
    bindCurrentFindings();
    render();
    toast(page.findings.length ? `AI 识别完成：${page.findings.length} 条问题` : "AI 识别完成，未发现问题");
  } catch (error) {
    console.error("AI 识别失败", error);
    toast(`AI 识别失败：${humanizeAiError(error.message || error).slice(0, 120)}`);
  } finally {
    button.disabled = false;
    button.textContent = "开始 AI 识别";
  }
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-select")) {
    closeCustomSelects();
  }
  if (!event.target.closest(".export-menu")) {
    $("#exportPopover")?.classList.add("hidden");
  }

  const openProject = event.target.closest("[data-open-project]");
  if (openProject) {
    switchToProject(openProject.dataset.openProject);
    return;
  }

  const editProject = event.target.closest("[data-edit-project]");
  if (editProject) {
    const project = workspaceState.projects.find((item) => item.id === editProject.dataset.editProject);
    if (!project) return;
    const nextName = prompt("请输入项目名称", project.name);
    if (nextName === null) return;
    project.name = nextName.trim() || "未命名走查项目";
    render();
    toast("项目名称已更新");
    return;
  }

  const switchProject = event.target.closest("[data-switch-project]");
  if (switchProject) {
    switchToProject(switchProject.dataset.switchProject);
    return;
  }

  const deleteProjectButton = event.target.closest("[data-delete-project]");
  if (deleteProjectButton) {
    deleteProject(deleteProjectButton.dataset.deleteProject);
    return;
  }

  if (event.target.closest("[data-project-name-input]")) {
    return;
  }

  const selectPage = event.target.closest("[data-select-page]");
  if (selectPage) {
    switchToPage(selectPage.dataset.selectPage, "upload");
    return;
  }

  const openPage = event.target.closest("[data-open-page]");
  if (openPage) {
    switchToPage(openPage.dataset.openPage, "upload");
    openReviewWorkspace();
    return;
  }

  const switchPage = event.target.closest("[data-switch-page]");
  if (switchPage) {
    switchToPage(switchPage.dataset.switchPage, "review");
    return;
  }

  const deletePage = event.target.closest("[data-delete-page]");
  if (deletePage) {
    deleteReviewPage(deletePage.dataset.deletePage);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-finding]");
  if (deleteButton) {
    deleteFinding(deleteButton.dataset.deleteFinding);
    return;
  }

  const deleteComment = event.target.closest("[data-delete-comment]");
  if (deleteComment) {
    const item = selectedFinding();
    if (!item) return;
    const index = Number(deleteComment.dataset.deleteComment);
    if (!Number.isInteger(index) || !item.comments[index]) return;
    item.comments.splice(index, 1);
    renderDetail();
    saveWorkspace();
    toast("已删除评论");
    return;
  }

  const issue = event.target.closest(".issue-row");
  if (issue && !event.target.matches("input, button")) {
    selectFinding(issue.dataset.id);
    return;
  }

  const exportAction = event.target.closest("[data-export-action]");
  if (exportAction) {
    exportTaskTable(exportAction.dataset.exportAction);
    $("#exportPopover")?.classList.add("hidden");
    return;
  }

  const segment = event.target.closest(".segment");
  if (segment) {
    state.view = segment.dataset.view;
    $$(".segment").forEach((item) => item.classList.toggle("active", item === segment));
    renderCanvas();
    return;
  }

  const chip = event.target.closest(".chip");
  if (chip) {
    state.filter = chip.dataset.filter;
    $$(".chip").forEach((item) => item.classList.toggle("active", item === chip));
    renderIssues();
  }
});

document.addEventListener("change", (event) => {
  const input = event.target.closest("[data-project-name-input]");
  if (!input) return;
  const project = workspaceState.projects.find((item) => item.id === input.dataset.projectNameInput);
  if (!project) return;
  project.name = input.value.trim() || "未命名走查项目";
  render();
  toast("项目名称已更新");
});

$("#projectTitleInput").addEventListener("change", (event) => {
  const project = currentProject();
  if (!project) return;
  project.name = event.target.value.trim() || "未命名走查项目";
  render();
  toast("项目名称已更新");
});

["#pageNameInput", "#pageDeviceInput", "#pageFigmaInput", "#pageImplementationUrlInput"].forEach((selector) => {
  $(selector).addEventListener("change", syncCurrentPageInputs);
});
$("#apiProviderInput").addEventListener("change", (event) => {
  workspaceState.apiConfig.provider = event.target.value;
  render();
});
$("#apiModelInput").addEventListener("change", (event) => {
  workspaceState.apiConfig.model = event.target.value.trim();
  render();
});
$("#apiBaseUrlInput").addEventListener("change", (event) => {
  workspaceState.apiConfig.baseUrl = event.target.value.trim() || "https://api.openai.com/v1";
  render();
});
$("#apiKeyInput").addEventListener("change", (event) => {
  workspaceState.apiConfig.apiKey = event.target.value.trim();
  render();
});
$("#toggleApiKey").addEventListener("click", () => {
  workspaceState.apiConfig.showKey = !workspaceState.apiConfig.showKey;
  renderShell();
});
$("#saveApiConfig").addEventListener("click", () => {
  syncApiConfigInputs();
  workspaceState.apiConfig.status = workspaceState.apiConfig.apiKey && workspaceState.apiConfig.model ? "已配置" : "未配置";
  saveWorkspace();
  renderShell();
  toast("模型配置已保存");
});
$("#testApiConfig").addEventListener("click", async () => {
  syncApiConfigInputs();
  const config = workspaceState.apiConfig;
  if (!config.baseUrl || !config.model || !config.apiKey) {
    toast("请填写 Base URL、模型名称和 API Key");
    return;
  }
  const button = $("#testApiConfig");
  button.disabled = true;
  button.textContent = "校验中...";
  $("#apiConfigHint").textContent = "正在校验模型连通性和图片识别能力...";
  try {
    await testVisionConfig(config);
    config.testedAt = new Date().toLocaleString("zh-CN");
    config.status = "视觉能力通过";
    $("#apiConfigHint").textContent = `校验通过：${config.model} 支持图片输入，可用于设计稿与开发截图识别。${config.testedAt}`;
    saveWorkspace();
    renderShell();
    toast("模型图片识别能力校验通过");
  } catch (error) {
    const message = humanizeAiError(error.message || error);
    config.status = "校验失败";
    $("#apiConfigHint").textContent = `校验失败：${message}`;
    saveWorkspace();
    renderShell();
    toast(`校验失败：${message.slice(0, 90)}`);
  } finally {
    button.disabled = false;
    button.textContent = "校验配置";
  }
});
$("#openApiConfig").addEventListener("click", () => {
  workspaceState.apiConfigModalOpen = true;
  renderShell();
});
$("#closeApiConfig").addEventListener("click", () => {
  workspaceState.apiConfigModalOpen = false;
  renderShell();
});
$("#closeApiConfigBackdrop").addEventListener("click", () => {
  workspaceState.apiConfigModalOpen = false;
  renderShell();
});
$("#createProjectTop").addEventListener("click", addProject);
$("#createProjectEmpty").addEventListener("click", addProject);
$("#addReviewPage").addEventListener("click", addReviewPage);
$("#deleteCurrentPage").addEventListener("click", () => {
  const page = currentPage();
  if (!page) return;
  deleteReviewPage(page.id);
});
$("#openCurrentPage").addEventListener("click", openReviewWorkspace);
$("#startAiReview").addEventListener("click", startAiReview);
$("#backToDashboard").addEventListener("click", () => {
  workspaceState.view = "dashboard";
  render();
});
$("#backToUpload").addEventListener("click", () => {
  workspaceState.view = "upload";
  render();
});
$("#designUploadInput").addEventListener("change", (event) => {
  readUpload(event.target.files?.[0], async (dataUrl, file) => {
    const page = currentPage();
    if (!page) return;
    const oldAssetId = page.designImageAssetId;
    const oldImageUrl = page.designImageUrl;
    const assetId = uid("asset-design");
    try {
      const uploaded = await uploadAssetToServer({ id: assetId, dataUrl, filename: file.name });
      if (oldAssetId) deleteAsset(oldAssetId).catch(() => {});
      if (oldAssetId || oldImageUrl) deleteAssetFromServer(oldAssetId || oldImageUrl.split("/").pop()?.split(".")[0]).catch(() => {});
      Object.assign(page, {
        designImageAssetId: uploaded.assetId,
        designImageUrl: uploaded.url,
        designImageDataUrl: "",
        designEmbedUrl: "",
        designFileName: file.name,
        designUpdatedAt: uploaded.updatedAt || new Date().toLocaleString("zh-CN"),
      });
      event.target.value = "";
      render();
      toast("设计稿已上传到协作后端");
    } catch (error) {
      console.warn("设计稿后端上传失败，回退到本地缓存。", error);
      try {
        await putAsset(assetId, dataUrl);
        if (oldAssetId) deleteAsset(oldAssetId).catch(() => {});
        Object.assign(page, {
          designImageAssetId: assetId,
          designImageUrl: "",
          designImageDataUrl: "",
          designEmbedUrl: "",
          designFileName: file.name,
          designUpdatedAt: new Date().toLocaleString("zh-CN"),
        });
        event.target.value = "";
        render();
        showCollaborationNotice("当前环境仅支持本地草稿，图片已暂存本机浏览器");
      } catch {
        toast("图片保存失败，请检查浏览器存储权限");
      }
    }
  });
});
$("#implementationUploadInput").addEventListener("change", (event) => {
  readUpload(event.target.files?.[0], async (dataUrl, file) => {
    const page = currentPage();
    if (!page) return;
    const oldAssetId = page.implementationImageAssetId;
    const oldImageUrl = page.implementationImageUrl;
    const assetId = uid("asset-implementation");
    try {
      const uploaded = await uploadAssetToServer({ id: assetId, dataUrl, filename: file.name });
      if (oldAssetId) deleteAsset(oldAssetId).catch(() => {});
      if (oldAssetId || oldImageUrl) deleteAssetFromServer(oldAssetId || oldImageUrl.split("/").pop()?.split(".")[0]).catch(() => {});
      Object.assign(page, {
        implementationImageAssetId: uploaded.assetId,
        implementationImageUrl: uploaded.url,
        implementationImageDataUrl: "",
        implementationFileName: file.name,
        implementationUpdatedAt: uploaded.updatedAt || new Date().toLocaleString("zh-CN"),
      });
      event.target.value = "";
      render();
      toast("开发截图已上传到协作后端");
    } catch (error) {
      console.warn("开发截图后端上传失败，回退到本地缓存。", error);
      try {
        await putAsset(assetId, dataUrl);
        if (oldAssetId) deleteAsset(oldAssetId).catch(() => {});
        Object.assign(page, {
          implementationImageAssetId: assetId,
          implementationImageUrl: "",
          implementationImageDataUrl: "",
          implementationFileName: file.name,
          implementationUpdatedAt: new Date().toLocaleString("zh-CN"),
        });
        event.target.value = "";
        render();
        showCollaborationNotice("当前环境仅支持本地草稿，图片已暂存本机浏览器");
      } catch {
        toast("图片保存失败，请检查浏览器存储权限");
      }
    }
  });
});
$("#deleteDesignAsset").addEventListener("click", () => {
  const page = currentPage();
  if (!page) return;
  const assetId = page.designImageAssetId;
  Object.assign(page, {
    designImageAssetId: "",
    designImageUrl: "",
    designImageDataUrl: "",
    designEmbedUrl: "",
    designFileName: "",
    designUpdatedAt: "",
  });
  deleteAsset(assetId).catch(() => {});
  deleteAssetFromServer(assetId).catch(() => {});
  render();
  toast("已删除设计稿截图");
});
$("#deleteImplementationAsset").addEventListener("click", () => {
  const page = currentPage();
  if (!page) return;
  const assetId = page.implementationImageAssetId;
  Object.assign(page, {
    implementationImageAssetId: "",
    implementationImageUrl: "",
    implementationImageDataUrl: "",
    implementationFileName: "",
    implementationUpdatedAt: "",
  });
  deleteAsset(assetId).catch(() => {});
  deleteAssetFromServer(assetId).catch(() => {});
  render();
  toast("已删除开发截图");
});

$("#overlayOpacity").addEventListener("input", (event) => {
  state.overlayOpacity = Number(event.target.value);
  renderCanvas();
});
$("#overlayOffsetX").addEventListener("input", (event) => {
  state.overlayOffsetX = clamp(Number(event.target.value) || 0, -120, 120);
  renderCanvas();
});
$("#overlayOffsetY").addEventListener("input", (event) => {
  state.overlayOffsetY = clamp(Number(event.target.value) || 0, -120, 120);
  renderCanvas();
});
$("#resetOverlayAlign").addEventListener("click", () => {
  state.overlayOffsetX = 0;
  state.overlayOffsetY = 0;
  renderCanvas();
  toast("叠图位置已重置");
});

$("#prioritySelect").addEventListener("change", (event) => selectedFinding() && updateSelected({ priority: event.target.value }));
$("#typeSelect").addEventListener("change", (event) => selectedFinding() && updateSelected({ type: event.target.value }));
$("#feSelect").addEventListener("change", (event) => selectedFinding() && updateSelected({ assignee_fe: event.target.value }));
$("#uiSelect").addEventListener("change", (event) => selectedFinding() && updateSelected({ reviewer_ui: event.target.value }));
$("#titleInput").addEventListener("change", (event) => selectedFinding() && updateSelected({ title: event.target.value }));
$("#observedText").addEventListener("change", (event) => selectedFinding() && updateSelected({ observed: event.target.value }));
$("#expectedText").addEventListener("change", (event) => selectedFinding() && updateSelected({ expected: event.target.value }));
$("#recommendationText").addEventListener("change", (event) => selectedFinding() && updateSelected({ recommendation: event.target.value }));
[
  "#manualPrioritySelect",
  "#manualTypeSelect",
  "#manualFeSelect",
  "#manualUiSelect",
  "#manualTitleInput",
  "#manualDetailInput",
].forEach((selector) => {
  $(selector).addEventListener("input", updateManualDraftFromInputs);
  $(selector).addEventListener("change", updateManualDraftFromInputs);
});
["#bboxLeftInput", "#bboxTopInput", "#bboxWidthInput", "#bboxHeightInput"].forEach((selector) => {
  $(selector).addEventListener("focus", () => {
    if (!state.pendingManualSelection && !state.editSnapshot) state.editSnapshot = snapshotState();
  });
  $(selector).addEventListener("input", () => updateAnnotationFromInputs({ commit: false }));
  $(selector).addEventListener("change", () => {
    if (state.editSnapshot) {
      pushUndo(state.editSnapshot);
      state.editSnapshot = null;
    }
    updateAnnotationFromInputs({ commit: true });
  });
});
$("#undoAnnotation").addEventListener("click", undoLastAction);
$("#redoAnnotation").addEventListener("click", redoLastAction);
$("#toolbarUndoAnnotation").addEventListener("click", undoLastAction);
$("#toolbarRedoAnnotation").addEventListener("click", redoLastAction);
$("#confirmManualSelection").addEventListener("click", confirmManualFinding);
$("#confirmSideAnnotation").addEventListener("click", confirmManualFinding);
$("#primaryFlowAction").addEventListener("click", () => {
  if (!selectedFinding()) {
    state.manualMode = true;
    render();
    toast("已进入人工标注模式");
    return;
  }
  const action = nextActionFor(selectedFinding())[2];
  if (action) action();
});
$("#secondaryFlowAction").addEventListener("click", () => {
  $("#uiReject").click();
});

$("#markFalse").addEventListener("click", () => {
  updateSelected({ workflow_status: "false_positive" });
  addHistory("标记为误报，移出 FE 待办。", "UI");
  render();
  toast("已标记为误报");
});
$("#splitIssue").addEventListener("click", () => {
  const source = selectedFinding();
  const clone = JSON.parse(JSON.stringify(source));
  clone.id = `F-${String(findings.length + 1).padStart(3, "0")}`;
  clone.title = `${source.title}（拆分项）`;
  clone.workflow_status = "ai_pending";
  clone.annotations.forEach((annotation) => {
    annotation.label = `${clone.priority}-${clone.id.slice(2)}`;
    annotation.created_by = "UI";
  });
  clone.comments = [{ author: "UI", content: "由人工核验拆分生成。" }];
  findings.push(clone);
  state.selectedId = clone.id;
  toast("已拆分为新的问题行");
  render();
});
$("#mergeIssue").addEventListener("click", () => {
  updateSelected({ workflow_status: "ui_confirmed" });
  addHistory("已标记需要与同类问题合并处理。", "UI");
  render();
  toast("已记录合并处理");
});
$("#acceptDeviation").addEventListener("click", () => {
  updateSelected({ workflow_status: "accepted_deviation" });
  addHistory("接受为可解释偏差，不进入 FE 待办。", "UI");
  render();
  toast("已接受为偏差");
});
$("#deleteFinding").addEventListener("click", () => {
  deleteFinding();
});
$("#sendToFe").addEventListener("click", () => {
  updateSelected({ workflow_status: "fe_todo" });
  addHistory(`已指派给 ${selectedFinding().assignee_fe} 修复。`, "UI");
  render();
  toast("已进入 FE 修复");
});
$("#feDoneCheck").addEventListener("change", (event) => {
  updateSelected({ workflow_status: event.target.checked ? "fe_done" : "fe_todo" });
  addHistory(event.target.checked ? "FE 已勾选完成。" : "FE 完成状态已撤销。", "FE");
  render();
});
$("#uiPass").addEventListener("click", () => {
  updateSelected({ workflow_status: "archived", archive_reason: "UI 复核通过" });
  addHistory("UI 复核通过，已归档。", "UI");
  render();
  toast("已归档");
});
$("#uiReject").addEventListener("click", () => {
  const comment = $("#commentInput").value.trim();
  if (!comment) {
    toast("退回 FE 前请先填写评论原因");
    return;
  }
  updateSelected({ workflow_status: "ui_rejected" });
  addHistory(`UI 退回 FE：${comment}`, "UI");
  $("#commentInput").value = "";
  render();
  toast("已退回 FE");
});
$("#addComment").addEventListener("click", () => {
  const input = $("#commentInput");
  if (!input.value.trim()) return;
  addHistory(input.value.trim(), "你");
  input.value = "";
  renderDetail();
});
function createManualFinding(target = "implementation", bbox = [20, 40, 28, 10], draft = state.manualDraft) {
  pushUndo(undefined, "新增人工标注");
  const id = `F-${String(findings.length + 1).padStart(3, "0")}`;
  const sharedBbox = normalizeBbox(bbox);
  const designBbox = [...sharedBbox];
  const implementationBbox = [...sharedBbox];
  const priority = draft.priority || "P2";
  const type = draft.type || "Layout";
  const title = draft.title || "人工新增标注问题";
  const detail = draft.detail || "人工新增，需要补充问题详情。";
  findings.push({
    id,
    title,
    priority,
    severity: "Medium",
    type,
    area: "人工框选区域",
    source: "manual",
    ai_confidence: 0.5,
    workflow_status: "ai_pending",
    assignee_fe: draft.assignee_fe || "前端负责人",
    reviewer_ui: draft.reviewer_ui || "设计负责人",
    figma_url: currentPage()?.figmaUrl || "",
    figma_node_id: "",
    archive_reason: "",
    observed: detail,
    expected: "请补充设计预期。",
    recommendation: "请补充修复建议。",
    comments: [{ author: "UI", content: "人工新增标注，已创建独立问题。" }],
    annotations: [
      { target: "design", bbox: designBbox, label: `${priority}-${id.slice(2)}`, created_by: "UI", updated_at: "刚刚" },
      { target: "implementation", bbox: implementationBbox, label: `${priority}-${id.slice(2)}`, created_by: "UI", updated_at: "刚刚" },
    ],
  });
  state.selectedId = id;
  state.annotationTarget = target;
  state.filter = "manual";
  $$(".chip").forEach((item) => item.classList.toggle("active", item.dataset.filter === "manual"));
  render();
}

$("#newAnnotation").addEventListener("click", () => {
  const nextManualMode = !state.manualMode;
  if (nextManualMode) {
    state.manualMode = true;
    state.selectedId = "";
    resetManualDraft();
  } else {
    exitManualCreateMode();
    state.selectedId = findings[0]?.id || "";
  }
  render();
  toast(state.manualMode ? "进入框选模式，请在截图上拖拽区域" : "已退出框选模式");
});
$("#exportTasks").addEventListener("click", (event) => {
  event.stopPropagation();
  $("#exportPopover").classList.toggle("hidden");
});

function startAnnotationDrag(event) {
  const current = selectedFinding();
  if (state.manualMode && current?.source !== "manual") return;
  const target = event.currentTarget.dataset.annotationTarget;
  const annotation = annotationForTarget(selectedFinding(), target);
  const mode = event.target.closest(".bbox-resize-handle") ? "resize" : "move";
  state.annotationTarget = target;
  state.drag = {
    mode,
    target,
    startX: event.clientX,
    startY: event.clientY,
    initial: [...annotation.bbox],
    snapshot: snapshotState(),
    frame: annotationFrame(target).getBoundingClientRect(),
  };
  event.currentTarget.setPointerCapture(event.pointerId);
  renderCanvas();
  renderDetail();
}

$("#designBbox").addEventListener("pointerdown", startAnnotationDrag);
$("#implementationBbox").addEventListener("pointerdown", startAnnotationDrag);

$("#implementationFrame").addEventListener("pointerdown", (event) => {
  if (state.manualMode || state.view !== "overlay" || event.target.closest(".bbox")) return;
  state.overlayDrag = {
    startX: event.clientX,
    startY: event.clientY,
    initialX: state.overlayOffsetX,
    initialY: state.overlayOffsetY,
  };
  $("#implementationFrame").setPointerCapture(event.pointerId);
  $("#compareStage").classList.add("aligning");
});

function startManualSelection(event) {
  if (!state.manualMode || event.target.closest(".bbox")) return;
  const pendingBox = event.target.closest(".selection-box.pending");
  if (pendingBox && state.pendingManualSelection) {
    const target = pendingBox.id === "designSelectionBox" ? "design" : "implementation";
    const rect = pendingBox.getBoundingClientRect();
    const mode = event.clientX >= rect.right - 24 && event.clientY >= rect.bottom - 24 ? "resize" : "move";
    state.selectionDrag = {
      mode,
      target,
      startX: event.clientX,
      startY: event.clientY,
      initial: [...state.pendingManualSelection.bbox],
      frame: annotationFrame(target).getBoundingClientRect(),
    };
    pendingBox.setPointerCapture(event.pointerId);
    return;
  }
  if (state.pendingManualSelection) return;
  const target = event.currentTarget.id === "designFrame" ? "design" : "implementation";
  const frame = annotationFrame(target).getBoundingClientRect();
  state.selection = {
    target,
    frame,
    startX: clamp(((event.clientX - frame.left) / frame.width) * 100, 0, 100),
    startY: clamp(((event.clientY - frame.top) / frame.height) * 100, 0, 100),
  };
  event.currentTarget.setPointerCapture(event.pointerId);
}

$("#designFrame").addEventListener("pointerdown", startManualSelection);
$("#implementationFrame").addEventListener("pointerdown", startManualSelection);

document.addEventListener("pointermove", (event) => {
  if (state.selection) {
    const currentX = clamp(((event.clientX - state.selection.frame.left) / state.selection.frame.width) * 100, 0, 100);
    const currentY = clamp(((event.clientY - state.selection.frame.top) / state.selection.frame.height) * 100, 0, 100);
    const left = Math.min(state.selection.startX, currentX);
    const top = Math.min(state.selection.startY, currentY);
    const width = Math.abs(currentX - state.selection.startX);
    const height = Math.abs(currentY - state.selection.startY);
    ["design", "implementation"].forEach((target) => {
      const selectionBox = $(`#${target}SelectionBox`);
      setBox(selectionBox, { bbox: [left, top, width, height] });
      selectionBox.classList.add("visible");
    });
    return;
  }
  if (state.selectionDrag && state.pendingManualSelection) {
    const dx = ((event.clientX - state.selectionDrag.startX) / state.selectionDrag.frame.width) * 100;
    const dy = ((event.clientY - state.selectionDrag.startY) / state.selectionDrag.frame.height) * 100;
    const bbox = [...state.selectionDrag.initial];
    if (state.selectionDrag.mode === "resize") {
      bbox[2] = clamp(bbox[2] + dx, 1, 100 - bbox[0]);
      bbox[3] = clamp(bbox[3] + dy, 1, 100 - bbox[1]);
    } else {
      bbox[0] = clamp(bbox[0] + dx, 0, 100 - bbox[2]);
      bbox[1] = clamp(bbox[1] + dy, 0, 100 - bbox[3]);
    }
    state.pendingManualSelection.bbox = normalizeBbox(bbox);
    renderCanvas();
    return;
  }
  if (state.overlayDrag) {
    state.overlayOffsetX = clamp(state.overlayDrag.initialX + event.clientX - state.overlayDrag.startX, -120, 120);
    state.overlayOffsetY = clamp(state.overlayDrag.initialY + event.clientY - state.overlayDrag.startY, -120, 120);
    renderCanvas();
    return;
  }
  if (!state.drag) return;
  const annotation = annotationForTarget(selectedFinding(), state.drag.target);
  const dx = ((event.clientX - state.drag.startX) / state.drag.frame.width) * 100;
  const dy = ((event.clientY - state.drag.startY) / state.drag.frame.height) * 100;
  if (state.drag.mode === "resize") {
    annotation.bbox[2] = clamp(state.drag.initial[2] + dx, 1, 100 - annotation.bbox[0]);
    annotation.bbox[3] = clamp(state.drag.initial[3] + dy, 1, 100 - annotation.bbox[1]);
  } else {
    annotation.bbox[0] = clamp(state.drag.initial[0] + dx, 0, 100 - annotation.bbox[2]);
    annotation.bbox[1] = clamp(state.drag.initial[1] + dy, 0, 100 - annotation.bbox[3]);
  }
  annotation.updated_at = "刚刚";
  renderCanvas();
  renderDetail();
});

document.addEventListener("pointerup", () => {
  if (state.selection) {
    const box = $(`#${state.selection.target}SelectionBox`);
    const left = Number.parseFloat(box.style.left) || 0;
    const top = Number.parseFloat(box.style.top) || 0;
    const width = Number.parseFloat(box.style.width) || 0;
    const height = Number.parseFloat(box.style.height) || 0;
    const target = state.selection.target;
    state.selection = null;
    if (width >= 0.5 && height >= 0.5) {
      state.pendingManualSelection = {
        target,
        bbox: normalizeBbox([left, top, width, height]),
      };
      renderCanvas();
      toast("已生成标注预览，请确认后创建问题");
    } else {
      renderCanvas();
      toast("框选区域过小，请重新拖拽");
    }
    return;
  }
  if (state.selectionDrag) {
    state.selectionDrag = null;
    renderCanvas();
    return;
  }
  if (state.overlayDrag) {
    state.overlayDrag = null;
    $("#compareStage").classList.remove("aligning");
    toast("叠图位置已调整");
    return;
  }
  if (state.drag) {
    pushUndo(state.drag.snapshot, state.drag.mode === "resize" ? "调整标注框尺寸" : "移动标注框");
    addHistory(`已${state.drag.mode === "resize" ? "调整尺寸" : "移动"}${state.drag.target === "design" ? "设计侧" : "实现侧"}标注框。`, "UI");
    renderDetail();
  }
  state.drag = null;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCustomSelects();
});

async function boot() {
  buildCustomSelects();
  await hydrateWorkspaceFromServer();
  applyShareHash();
  await migrateInlineAssetsToIndexedDb().catch(() => toast("图片迁移到 IndexedDB 失败，请重新上传图片"));
  render();
  hydratePageAssets();
}

boot();
