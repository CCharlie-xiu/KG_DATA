# KG_DATA — Agent 指南

静态知识站：`data/` 是唯一内容源，`src/` 是 React 查看器。

跨项目归档遵循用户 Skill `kg-ingest`（路径 `C:\Users\lin\.cursor\skills\kg-ingest`）。**无需用户 @ Skill**：方案在业务项目已验证可行，或用户要求归档/记笔记/回填时，Agent 自行读取 Skill 写入本库；写完后默认 commit，并更新 GitHub Pages（`gh-pages`）。用户说「先别入库 / 先别发布」则跳过。

## 目录地图

```
data/
  catalog.json              # 首页目录（唯一登记处）
  gates.json                # section 与门禁
  schema/collection.schema.json
  collections/<id>/         # 每条知识自包含
archives/                   # 按日快照，勿手改
src/                        # 查看器
```

## 双轴分类（入库必填）

| 轴 | 字段 | 取值 |
|---|---|---|
| 领域 | `category` | `analytics` / `drama` / `rpa` / `ops` / `other` |
| 看板 | `section` | `architecture` / `design` / `breakthrough` / `ui-kit`（`search` 仅检索，不作条目归类） |

启发式：架构接入→`architecture`；产品/埋点方案→`design`；踩坑解法→`breakthrough`；可复用 UI→`ui-kit`。

## 新增一条知识（article）

1. 建 `data/collections/<id>/`，`id` 匹配 `^[a-z0-9-]+$`
2. 写 `meta.json`（`title`、`body` 或 `sections[]`、可选 `sourceProject`）
3. 在 `data/catalog.json` → `collections` 登记同一 `id`
4. `status: "published"` + `viewer: "article"` 才能从首页进详情
5. `section` 必须是 `gates.json` 已有 id

## 禁止

- 手改 `archives/`
- 新增第二套 `viewer: "ga-catalog"` 而不改 `GaCatalog.tsx`（当前硬编码 `safrica-funzone-ga`）
- 把密钥、半成品、一次性调试过程写入库

## 本地

```bash
npm install
npm run dev
```

路由 Hash：`#/c/<id>`、`#/s/<section>`。
