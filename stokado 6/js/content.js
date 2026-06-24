/**
 * STOKADO Content Loader
 * ─────────────────────────────────────────────
 * This module is the CMS abstraction layer.
 *
 * TODAY:   reads from /data/products.json + /data/brand.json
 * FUTURE:  swap fetchProducts() / fetchBrand() to call
 *          Sanity GROQ, Contentful GraphQL, or Decap CMS API.
 *          The rest of the site does not change.
 *
 * Usage:
 *   const { products, brand } = await STOKADO.load();
 */

const STOKADO = (() => {

  // ── Data sources ──────────────────────────────────────────
  // To connect a CMS: replace these URLs with your API endpoints.
  // Sanity:     `https://{projectId}.api.sanity.io/v2024-01-01/data/query/{dataset}?query=*[_type=="product"]`
  // Contentful: `https://cdn.contentful.com/spaces/{spaceId}/entries?content_type=product`
  // Decap CMS:  reads from these same JSON files (no change needed)

  const SOURCES = {
    products: '/data/products.json',
    brand:    '/data/brand.json',
  };

  const FALLBACK_IMAGE = 'images/fallback-product.png';

  // ── Fetch helpers ─────────────────────────────────────────

  async function fetchProducts() {
    try {
      const res = await fetch(SOURCES.products);
      const data = await res.json();
      return data.products || [];
    } catch (e) {
      console.warn('[STOKADO] Could not load products:', e);
      return [];
    }
  }

  async function fetchBrand() {
    try {
      const res = await fetch(SOURCES.brand);
      return await res.json();
    } catch (e) {
      console.warn('[STOKADO] Could not load brand data:', e);
      return {};
    }
  }

  // ── Filters ───────────────────────────────────────────────

  function filterProducts(products, opts = {}) {
    let result = products.filter(p => p.status === 'active');
    if (opts.featured) result = result.filter(p => p.featured);
    if (opts.gender)   result = result.filter(p => p.gender === opts.gender);
    if (opts.category) result = result.filter(p => p.category === opts.category);
    result.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));
    return result;
  }

  // ── Renderers ─────────────────────────────────────────────

  function formatPrice(price, currency = 'PHP') {
    return `₱ ${price.toLocaleString()}`;
  }

  function productBrand(product) {
    return product.brand || 'STOKADO';
  }

  function productTitle(product) {
    return `${productBrand(product)} ${product.model}`;
  }

  function productTypeLabel(product) {
    return product.type_label || product.category_label || 'Everyday Footwear';
  }

  function productTagline(product) {
    return product.product_tagline || product.lifestyle_line || '';
  }

  function purchaseName(product) {
    return `${productTitle(product)} — ${product.colorway}`;
  }

  function productImage(product) {
    return product.image || product.image_transparent || FALLBACK_IMAGE;
  }

  function renderProductCard(product) {
    const img = productImage(product);
    const title = productTitle(product);
    const typeLabel = productTypeLabel(product);
    const tagline = productTagline(product);
    const badge = product.badge
      ? `<span class="pcard-badge">${product.badge}</span>`
      : '';
    return `
      <article class="pcard" data-product-id="${product.id}"
        itemscope itemtype="https://schema.org/Product">
        ${badge}
        <div class="pcard-visual">
          <img src="${img}"
            alt="STOKADO ${product.model} ${product.colorway}"
            itemprop="image" loading="lazy"/>
        </div>
        <div class="pcard-info">
          <div class="pcard-meta">
            <span class="pcard-name" itemprop="name">${title}</span>
            <span class="pcard-gender">${product.gender}</span>
          </div>
          <div class="pcard-category" itemprop="category">${typeLabel}</div>
          <div class="pcard-variant">${product.colorway}</div>
          ${tagline ? `<div class="pcard-lifestyle" itemprop="description">${tagline}</div>` : ''}
          <meta itemprop="brand" content="${productBrand(product)}"/>
          <div class="pcard-bottom">
            <div class="pcard-price"
              itemprop="offers" itemscope itemtype="https://schema.org/Offer">
              <span itemprop="priceCurrency" content="${product.currency}">₱</span><span
              itemprop="price" content="${product.price}">${product.price.toLocaleString()}</span>
            </div>
            <button class="pcard-add js-buy-now"
              type="button"
              data-product-id="${product.id}"
              aria-label="Buy ${purchaseName(product)}">
              Buy Now
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderHeroProduct(product) {
    const img = productImage(product);
    return {
      img,
      name: productTitle(product),
      typeLabel: productTypeLabel(product),
      tagline: productTagline(product),
      colorway: product.colorway,
      price: formatPrice(product.price),
      sizes: product.sizes,
      itemId: product.id,
      itemPrice: product.price,
    };
  }

  function productSchema(product, position) {
    return {
      '@type': 'Product',
      position,
      sku: product.sku,
      name: productTitle(product),
      description: product.description || productTagline(product),
      category: productTypeLabel(product),
      image: productImage(product),
      brand: { '@id': 'https://stokadoofficial.com/#organization' },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'PHP',
        availability: 'https://schema.org/InStock',
        url: `https://stokadoofficial.com/#collection`
      }
    };
  }

  function injectProductSchema(products) {
    const existing = document.getElementById('stokado-product-schema');
    if (existing) existing.remove();

    const activeProducts = filterProducts(products);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'stokado-product-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': 'https://stokadoofficial.com/#products',
      name: 'STOKADO Everyday Footwear Collection',
      itemListElement: activeProducts.map((product, index) => productSchema(product, index + 1))
    });
    document.head.appendChild(script);
  }

  // ── Main load ─────────────────────────────────────────────

  async function load() {
    const [products, brand] = await Promise.all([
      fetchProducts(),
      fetchBrand(),
    ]);
    return { products, brand, filterProducts, renderProductCard, renderHeroProduct, productTitle, productTypeLabel, productTagline, purchaseName, productImage, injectProductSchema };
  }

  return { load, filterProducts, renderProductCard, renderHeroProduct, formatPrice, productTitle, productTypeLabel, productTagline, purchaseName, productImage, injectProductSchema };

})();

window.STOKADO = STOKADO;
