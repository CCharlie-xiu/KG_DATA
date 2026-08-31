# KG_DATA

内部知识与方案归档。首页是目录，可切换到任意条目。数据全部放在仓库 `data/` 里，GitHub Pages 静态发布。

- 仓库：https://github.com/CCharlie-xiu/KG_DATA
- 线上：https://ccharlie-xiu.github.io/KG_DATA/
- 南非埋点：https://ccharlie-xiu.github.io/KG_DATA/#/c/safrica-funzone-ga

## 目录

```
data/
  catalog.json                 # 首页目录（唯一登记处）
  schema/collection.schema.json
  collections/
    safrica-funzone-ga/        # 南非 FunZone GA4 埋点
    short-drama/               # 短剧（占位）
    rpa-playbooks/             # RPA（占位）
archives/                      # 按日归档
src/                           # React 查看器
```

## 本地

```bash
npm install
npm run dev
```

打开 http://localhost:5173 。路由是 Hash：`#/c/safrica-funzone-ga`。

## 新增一条知识

1. 建 `data/collections/<id>/`，至少放 `meta.json`
2. 在 `data/catalog.json` 的 `collections` 里登记同一 `id`
3. `status` 为 `published` 才能从首页点进去；`planned` 只占位

短剧、RPA 已占位，补数据即可。

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
