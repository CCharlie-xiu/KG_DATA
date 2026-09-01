# KG_DATA

内部知识与方案归档。首页是目录，可切换到任意条目。数据全部放在仓库 `data/` 里，GitHub Pages 静态发布。

- 仓库：https://github.com/CCharlie-xiu/KG_DATA
- 线上：https://ccharlie-xiu.github.io/KG_DATA/
- 南非埋点：https://ccharlie-xiu.github.io/KG_DATA/#/c/safrica-funzone-ga

## 目录

```
data/
  catalog.json                 # 首页目录（唯一登记处）
  gates.json                   # section 与门禁
  schema/collection.schema.json
  collections/
    safrica-funzone-ga/        # 南非 FunZone GA4 埋点
    kg-ingest-playbook/        # 跨项目回填约定（article 样例）
    short-drama/               # 短剧（占位）
    rpa-playbooks/             # RPA（占位）
    _templates/                # meta 模板（不登记 catalog）
archives/                      # 按日归档
src/                           # React 查看器
AGENTS.md                      # Agent 维护约定
```

## 分类地图

**领域 `category`：** `analytics`（埋点/分析）· `drama`（短剧）· `rpa` · `ops`（运营）· `other`

**看板 `section`（`gates.json`）：**

| id | 标签 | 鉴权 |
|---|---|---|
| architecture | 架构方案 | 要 |
| design | 设计文档 | 否 |
| breakthrough | 核心突破 | 要 |
| ui-kit | UI库存 | 要 |

启发式：架构接入→`architecture`；产品/埋点→`design`；踩坑解法→`breakthrough`；可复用 UI→`ui-kit`。

跨项目归档用 Cursor Skill `kg-ingest`（写入本仓库 `data/`）。

## 本地

```bash
npm install
npm run dev
```

打开 http://localhost:5173 。路由是 Hash：`#/c/safrica-funzone-ga`。

## 新增一条知识

1. 建 `data/collections/<id>/`，至少放 `meta.json`（article 用 `body` 或 `sections[]`）
2. 在 `data/catalog.json` 的 `collections` 里登记同一 `id`，并填 `category` + `section`
3. `status` 为 `published` 才能从首页点进去；`planned` 只占位
4. 字段约定见 `data/schema/collection.schema.json` 与 `AGENTS.md`

短剧、RPA 已占位，补数据即可。架构方案示例：`#/c/xmkf-rpa-response-delay`（工作流延迟返回）。

## 归档

```bash
npm run archive
```

生成 `archives/YYYY-MM-DD/` 和 `archives/KG_DATA-YYYY-MM-DD.zip`。

## 发布 Pages

当前用 `gh-pages` 分支静态发布（OAuth 没有 `workflow` 权限，暂不走 Actions）。

```bash
# Windows PowerShell
$env:VITE_BASE="/KG_DATA/"
npm run build
npx gh-pages -d dist -b gh-pages
```

若以后补上 `workflow` scope，可把 `.github/workflows/pages.yml` 推上 main，改为 Actions 自动发布。
