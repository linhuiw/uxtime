# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

UXTIME DESIGN（沐川系设计）工作室的官方展示站点 —— 一个**纯静态 HTML 网站**，没有构建系统、没有框架、没有包管理器。通过 GitHub Pages 部署，绑定域名 `uxtime.com`（见 `CNAME`）。

## 开发与部署

- **本地预览**：直接用静态服务器打开根目录即可，例如 `python3 -m http.server 8000`，然后访问 `http://localhost:8000/index.html`。无需安装任何依赖。
- **部署**：`git push` 到 `origin/main`（`git@github.com:linhuiw/uxtime.git`）后由 GitHub Pages 自动发布。**没有**构建、lint 或测试步骤——所见即所得。
- **PHP 表单后端无法在 GitHub Pages 运行**：`process.php`、`we_connect.php`、`a.php` 以及 `class.*.php`（PHPMailer/POP3/SMTP）是历史遗留的服务端代码，依赖外部 SMTP 服务器，只能在支持 PHP 的主机上运行，在当前 Pages 部署中是静态文件、不会执行。

## 架构与约定（关键）

**每个页面都是自包含的，没有模板/组件复用。** 这是本仓库最重要的特征，直接影响所有改动方式：

- **导航栏、页脚、Google Analytics（gtag，ID `G-KF78LMRCN6`）在每个 HTML 文件中都是复制粘贴的**。修改导航项、页脚版权或统计代码时，必须手动同步到所有相关页面，不能只改一处。导航容器统一为 `#nav-magline`，四个栏目固定为：案例 / 服务 / 新闻 / 我们。
- **布局基于 `<table>`**（XHTML 1.0 Transitional），宽度多为固定 `882`/`883`/`642` 像素，非响应式。新增内容请沿用既有的表格结构，不要混入现代 flex/grid。
- **样式分两层**：根级 `base.css` 是全站 CSS reset（`@charset "utf-8"`）；每个页面顶部还有大段内联 `<style>`，定义 `.STYLE1`、`.STYLE2` 等编号样式类（颜色/字号/字体）。页面级视觉调整改内联样式，全局基础样式改 `base.css`。
- **JS 依赖**：jQuery 1.9.0 从又拍云 CDN（`//upcdn.b0.upaiyun.com`）引入；`js/libs/` 下另有本地 jQuery 1.5.1、Modernizr、responsiveslides 等。首页轮播用 `responsiveSlides`（`#slider4`），导航 hover 动效用 `js/magic-line.js`。

## 页面命名约定

按栏目用前缀区分，便于定位：

- `index.html` —— 首页（新闻栏目入口）
- `anli-*.html` —— 案例列表页（`anli-all`、`anli-brand`、`anli-mobile`、`anli-product`、`anli-software`、`anli-new` 等分类）
- `fuwu.html` —— 服务介绍页；`fuwu-case-*.html` —— 单个案例详情页（如 `fuwu-case-reddot`、`fuwu-case-vehicle01`，约 30 个）
- `we.html` / `we_job.html` / `we_connect.*` —— 关于我们 / 招聘 / 联系
- `xianyu-*.html` —— 其他专题页
- `500.html` —— 错误页

首页、案例页、详情页改动通常需要联动：例如首页 `index.html` 的轮播图和宫格卡片都硬编码链接到具体的 `fuwu-case-*.html`。

## 易踩的坑

- **字符编码混用**：绝大多数 HTML 是 `charset=utf-8`，但少数历史文件（如 `we_connect.php`）是 `charset=gb2312`，在 UTF-8 环境下显示为乱码。编辑 gb2312 文件前先确认编码，避免破坏中文内容。
- **两个并行的图片目录**：`images/`（主目录，约 280 个文件，含 `images/anli/<案例名>/`）和 `img/`（约 36 个文件，如 `img/index/`）。引用图片前先确认资源在哪个目录。
- **存在带空格的文件名**：如 `anli-brand .html`（注意 `brand` 后的空格），与 `anli-brand.html` 并存，操作时注意区分、需要时给路径加引号。
- **`process.php` 中明文写有 SMTP 账号密码**。改动该文件时请勿将其复制扩散，也不要在此基础上新增明文凭证。
