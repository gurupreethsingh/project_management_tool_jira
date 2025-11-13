package entity;

import java.util.List;

public class Product {

    // ========== Basic Details ==========
    private String product_name;
    private String slug;
    private String description;
    private String sku;
    private String brand;
    private String barcode;
    private String color;
    private String material;
    private List<String> tags;

    // ========== Pricing ==========
    private Double display_price;
    private Double selling_price;
//    private Double discount;
//    private Double bundle_price;
//    private Double popularity_score;

    // ========== Stock & Inventory ==========
    private Integer stock;
//    private List<WarehouseStock> warehouse_stock;
//    private Integer total_products_sold;
//    private Integer min_purchase_qty;
//    private Integer max_purchase_qty;

    // ========== Media ==========
//    private String product_image;
//    private List<String> all_product_images;

    // ========== Relations ==========
    private String category;
    private String subcategory;
    private String vendor;
    private String outlet;
//    private List<String> related_products;
	public String getProduct_name() {
		return product_name;
	}
	public void setProduct_name(String product_name) {
		this.product_name = product_name;
	}
	public String getSlug() {
		return slug;
	}
	public void setSlug(String slug) {
		this.slug = slug;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getSku() {
		return sku;
	}
	public void setSku(String sku) {
		this.sku = sku;
	}
	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public String getBarcode() {
		return barcode;
	}
	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getMaterial() {
		return material;
	}
	public void setMaterial(String material) {
		this.material = material;
	}
	public List<String> getTags() {
		return tags;
	}
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	public Double getDisplay_price() {
		return display_price;
	}
	public void setDisplay_price(Double display_price) {
		this.display_price = display_price;
	}
	public Double getSelling_price() {
		return selling_price;
	}
	public void setSelling_price(Double selling_price) {
		this.selling_price = selling_price;
	}
	public Integer getStock() {
		return stock;
	}
	public void setStock(Integer stock) {
		this.stock = stock;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getSubcategory() {
		return subcategory;
	}
	public void setSubcategory(String subcategory) {
		this.subcategory = subcategory;
	}
	public String getVendor() {
		return vendor;
	}
	public void setVendor(String vendor) {
		this.vendor = vendor;
	}
	public String getOutlet() {
		return outlet;
	}
	public void setOutlet(String outlet) {
		this.outlet = outlet;
	}

    // ========== Dimensions ==========
//    private Dimensions dimensions;
//
//    // ========== Status Flags ==========
//    private Boolean featured;
//    private Boolean is_new_arrival;
//    private Boolean is_trending;
//    private Boolean availability_status;
//
//    // ========== Metadata ==========
//    private String origin_country;
//    private String delivery_time_estimate;
//    private String replacement_policy;
//    private String meta_title;
//    private String meta_description;
//    private String admin_notes;
//    private Integer version;
//
//    // ========== Section / Campaign ==========
//    private List<String> section_to_appear;
//    private Campaign campaign;
//
//    // ========== Reviews & Analytics ==========
//    private Integer ratings;
//    private Double avg_rating;
//    private Integer total_reviews;
//
//    // ========== Optional Links ==========
//    private List<String> wishlist_users;
//    private List<String> orders;
//    private List<String> purchases;
//    private List<String> returns;
//    private List<String> questions;
//
//    // ========== System Fields ==========
//    private Boolean isDeleted;
//    private String createdBy;
//    private String updatedBy;
//    private String createdAt;
//    private String updatedAt;

    // ========== Getters & Setters ==========

    
}
