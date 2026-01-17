import { getTenantSlugFromPath } from "./tenant";

const DEFAULT_BASE_URL = "http://localhost:5000";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || DEFAULT_BASE_URL;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const message = await safeMessage(res);
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

async function safeMessage(res: Response) {
  try {
    const body = await res.json();
    return body?.message || body?.error;
  } catch (err) {
    return res.statusText;
  }
}

export interface StoreProductImage {
  url: string;
  alt?: string;
  is_primary?: boolean;
  public_id?: string;
}

export interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  unit?: string;
  category?: string;
  tags?: string[];
  image: string;
  images: StoreProductImage[];
  stock?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface CatalogParams {
  tenantSlug: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  inStock?: boolean;
  signal?: AbortSignal;
}

export interface CatalogResponse {
  items: StoreProduct[];
  pagination: { page: number; limit: number; total: number; pages: number };
  store?: { name?: string; slug?: string; currency?: string };
}

export async function getStoreInfo(tenantSlug: string) {
  const url = `${getApiBaseUrl()}/stores/${tenantSlug}`;
  const res = await fetchJson<{ success?: boolean; data: { store: { name?: string; slug?: string; currency?: string } } }>(url);
  return res.data.store;
}

export async function getStoreCatalog(params: CatalogParams): Promise<CatalogResponse> {
  const {
    tenantSlug,
    page = 1,
    limit = 20,
    search,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    inStock,
    signal,
  } = params;

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (search) qs.set("search", search);
  if (category) qs.set("category", category);
  if (minPrice !== undefined) qs.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) qs.set("maxPrice", String(maxPrice));
  if (sortBy) qs.set("sortBy", sortBy);
  if (sortOrder) qs.set("sortOrder", sortOrder);
  if (inStock !== undefined) qs.set("inStock", String(inStock));

  const url = `${getApiBaseUrl()}/stores/${tenantSlug}/catalog?${qs.toString()}`;
  const res = await fetchJson<{
    success?: boolean;
    data: { products: any[]; pagination: CatalogResponse["pagination"]; store?: CatalogResponse["store"] };
  }>(url, { signal });

  const products = res.data.products.map(mapProduct);
  return { items: products, pagination: res.data.pagination, store: res.data.store };
}

export async function getStoreCategories(tenantSlug: string) {
  const url = `${getApiBaseUrl()}/stores/${tenantSlug}/categories`;
  const res = await fetchJson<{ success?: boolean; data: { categories: string[] } }>(url);
  return res.data.categories;
}

export async function getStoreProduct(tenantSlug: string, productSlug: string, signal?: AbortSignal) {
  const url = `${getApiBaseUrl()}/stores/${tenantSlug}/products/${productSlug}`;
  const res = await fetchJson<{ success?: boolean; data: { product: any } }>(url, { signal });
  return mapProduct(res.data.product);
}

export function mapProduct(raw: any): StoreProduct {
  const images: StoreProductImage[] = Array.isArray(raw?.images) ? raw.images : [];
  const primaryImage =
    images.find((img) => img?.is_primary)?.url || images[0]?.url || raw?.image || "/placeholder.svg";

  return {
    id: String(raw._id || raw.id || raw.slug || ""),
    slug: String(raw.slug || raw._id || raw.id || ""),
    name: raw.name || "Untitled product",
    description: raw.description,
    price: Number(raw.price ?? raw.compare_price ?? 0),
    comparePrice: raw.compare_at_price ?? raw.compare_price,
    unit: raw.unit || "piece",
    category: raw.category,
    tags: raw.tags,
    image: primaryImage,
    images,
    stock: raw.stock_quantity ?? raw.total_quantity ?? raw.stock,
    isActive: raw.is_active ?? true,
    createdAt: raw.created_at || raw.updated_at,
  };
}

export function extractTenantSlug(pathname: string) {
  return getTenantSlugFromPath(pathname);
}
