"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StoreHeader } from "@/components/store-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { ProductCard } from "@/components/product-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { getStoreCatalog, getStoreCategories } from "@/lib/store-api";

export default function StoreSlugPage() {
	const router = useRouter();
	const params = useParams();
	const tenantSlug = decodeURIComponent((params?.slug || "").toString());
	const { addToCart } = useCart();
	const { toggleWishlist, isWishlisted } = useWishlist();

	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!tenantSlug) return;

		setLoading(true);
		setError("");

		const controller = new AbortController();

		Promise.all([
			getStoreCatalog({ tenantSlug, limit: 24, inStock: true, signal: controller.signal }),
			getStoreCategories(tenantSlug),
		])
			.then(([catalogRes, cats]) => {
				setProducts(catalogRes.items || []);
				setCategories(cats || []);
			})
			.catch((err) => setError(err.message || "Failed to load store"))
			.finally(() => setLoading(false));

		return () => controller.abort();
	}, [tenantSlug]);

	// If someone lands on /store without slug, push home
	useEffect(() => {
		if (!tenantSlug) router.replace("/");
	}, [tenantSlug, router]);

	return (
		<div className="min-h-screen pb-20 lg:pb-0 bg-background">
			<DesktopSidebar />

			<div className="lg:ml-64">
				<StoreHeader showSearch storeName={tenantSlug} />

				<main className="max-w-md lg:max-w-7xl mx-auto px-4 py-6 space-y-6">
					<Card className="p-4 bg-muted/40">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-xl font-bold">Store: {tenantSlug}</h1>
								<p className="text-sm text-muted-foreground">Browse products from this tenant.</p>
							</div>
						</div>
					</Card>

					<section className="space-y-3">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">Categories</h2>
						</div>
						{loading && <p className="text-sm text-muted-foreground">Loading...</p>}
						{error && <p className="text-sm text-destructive">{error}</p>}
						{!loading && categories.length === 0 && !error && (
							<p className="text-sm text-muted-foreground">No categories yet.</p>
						)}
						<div className="flex flex-wrap gap-2">
							{categories.map((cat) => (
								<span key={cat} className="px-3 py-1 rounded-full bg-muted text-sm">
									{cat}
								</span>
							))}
						</div>
					</section>

					<section className="space-y-3">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">Products</h2>
							<div className="text-sm text-muted-foreground">{products.length} items</div>
						</div>

						{loading && <p className="text-sm text-muted-foreground">Loading products...</p>}
						{error && <p className="text-sm text-destructive">{error}</p>}
						{!loading && products.length === 0 && !error && (
							<p className="text-sm text-muted-foreground">No products available.</p>
						)}

						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
							{products.map((product) => (
								<ProductCard
									key={product.id}
									id={product.id}
									name={product.name}
									price={product.price}
									comparePrice={product.comparePrice}
									image={product.image}
									unit={product.unit}
									href={`/store/${tenantSlug}/products/${product.slug || product.id}`}
									onAddToCart={() =>
										addToCart({
											id: product.id,
											name: product.name,
											price: product.price,
											unit: product.unit || "piece",
											image: product.image,
										})
									}
									onToggleWishlist={() => toggleWishlist(product.id)}
									isWishlisted={isWishlisted(product.id)}
								/>
							))}
						</div>
					</section>
				</main>
			</div>

			<BottomNavigation />
		</div>
	);
}
