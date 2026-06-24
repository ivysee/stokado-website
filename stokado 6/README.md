# STOKADO Official Website

完整品牌官网，一个 HTML 文件搞定。

---

## 上线步骤（30分钟完成）

### 第一步：准备文件
1. 在电脑新建文件夹 `stokado`
2. 把 `index.html` 放进去
3. 在里面再建一个 `images` 文件夹
4. 把你的产品图片放进 `images/` 文件夹，命名：
   - `images/shoe-front.jpg`（正面图）
   - `images/shoe-rear.jpg`（背面图）
   - `images/product-3.jpg` 到 `images/product-10.jpg`（其余产品）

### 第二步：注册 GitHub
1. 去 https://github.com 注册免费账号
2. 点 `New repository`（新建仓库）
3. 仓库名填：`stokadoofficial.com`（或任意名字）
4. 选 `Public`（公开）
5. 点 `Create repository`

### 第三步：上传文件
1. 在仓库页面点 `uploading an existing file`
2. 把整个 `stokado` 文件夹拖进去
3. 点 `Commit changes`

### 第四步：开启 GitHub Pages
1. 进入仓库 → `Settings` → `Pages`
2. Source 选 `main` branch，`/ (root)` 文件夹
3. 点 `Save`
4. 几分钟后你会得到一个 `https://yourusername.github.io/stokadoofficial.com/` 地址

### 第五步：绑定自定义域名 stokadoofficial.com
1. 在 GitHub Pages 设置里，`Custom domain` 填入 `stokadoofficial.com`
2. 去你的域名注册商（Shopify 买的域名去 Shopify Domains）
3. 添加 DNS 记录：
   ```
   A记录  @  185.199.108.153
   A记录  @  185.199.109.153
   A记录  @  185.199.110.153
   A记录  @  185.199.111.153
   CNAME  www  yourusername.github.io
   ```
4. 等 24 小时 DNS 生效，网站就上线了

---

## 商品购买渠道

官网不提供购物车、结账或付款功能。

顾客点击商品的 `BUY NOW` 后，会看到 `Available On` 弹窗，并前往：

- TikTok Shop
- Shopee
- Lazada

每个商品的渠道链接配置在：

- `data/products.json` → `purchase_links`

缺少链接的平台会自动隐藏。

---

## Google Analytics 4

网站已经预设以下事件：

- `page_view`
- `buy_now_click`，包含 `product_name`
- `platform_click`，包含 `product_name` 和 `platform_name`

在 `index.html` 顶部将：

```js
ga4MeasurementId: 'G-XXXXXXXXXX'
```

替换为 Google Analytics 提供的真实 Measurement ID。所有事件同时进入 `dataLayer`，可供未来 Google Tag Manager 使用。

---

## 替换产品信息

产品信息现在由 JSON 数据驱动。只修改：

- `data/products.json`：网站唯一读取的产品数据源

每个产品支持这些品牌命名字段：

- `brand`：品牌前缀，例如 `STOKADO`
- `type_label`：产品类型，例如 `Everyday Court Sneaker`
- `category_label`：卡片分类标签，例如 `Everyday Sneaker`
- `product_tagline`：产品短句，例如 `Made for daily city movement`
- `lifestyle_line`：生活方式使用场景，例如 `For commutes, campus days, and easy weekends`

---

## Google Entity（让 Google 认识你）

网站头部已内置 JSON-LD Schema，Google 爬取后会把 STOKADO 识别为：
- 一个真实的菲律宾 footwear brand
- 一个以 everyday footwear 为核心的品牌实体
- 一个拥有产品系列、社交渠道和销售渠道的品牌组织

额外建议：
1. 注册 Google Business Profile（免费）
2. 在 Wikipedia 或 Wikidata 建立 STOKADO 词条
3. 在 Crunchbase 建立公司页面

---

## 文件结构

```
stokado/
├── index.html          ← 完整网站（这个文件）
├── images/
│   ├── shoe-front.jpg
│   ├── shoe-rear.jpg
│   ├── product-3.jpg
│   └── ... (其余产品图)
└── README.md
```

---

## 联系 & 更新

更新产品、价格、图片或购买渠道：编辑 `data/products.json`，重新上传到 GitHub 即可。

需要帮助？继续问 Claude。
