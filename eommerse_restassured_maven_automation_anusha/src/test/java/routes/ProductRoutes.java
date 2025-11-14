package routes;

import generic.AutomationConstants;

public class ProductRoutes implements AutomationConstants
{
	
	public String post_add_product_route = globalBackendRoute+"/api/add-product";
	public String get_all_added_products= globalBackendRoute+"/api/all-added-products";
	public String get_single_added_product_by_id=globalBackendRoute+"/api/get-single-added-product-by-id/";// +{id};
	public String get_products_by_category_id=globalBackendRoute+"/api/get-products-by-category/"; // + {categoryId};
	public String get_products_by_subcategory_subCategoryId=globalBackendRoute+"/api/get-products-by-subcategory/";//+{subCategoryId};
	public String get_products_sorted= globalBackendRoute+"/api//get-products-sorted";                                             		 		 	 
	public String put_update_product_by_id = globalBackendRoute + "/api/update-product/"; // + {id}

	// ====== DELETE ======
	public String delete_product_by_id = globalBackendRoute + "/api/delete-product/"; // + {id}

	// ====== COUNTS ======
	public String get_count_all_products = globalBackendRoute + "/api/count-all-products";
	public String get_count_products_by_category = globalBackendRoute + "/api/count-products-by-category";
	public String get_count_products_by_subcategory = globalBackendRoute + "/api/count-products-by-subcategory";
	public String get_count_products_by_vendor = globalBackendRoute + "/api/count-products-by-vendor";
	public String get_count_products_by_status = globalBackendRoute + "/api/count-products-by-status";
	public String get_count_products_by_section = globalBackendRoute + "/api/count-products-by-section";
}
