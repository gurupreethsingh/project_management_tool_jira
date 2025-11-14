package routes;

import generic.AutomationConstants;

public class CategoryRoutes implements AutomationConstants
{

	public String post_add_category_route = globalBackendRoute+ "/api/add-category";
	public String get_all_categories_route = globalBackendRoute+ "/api/all-categories";
	public String get_category_by_id_route = globalBackendRoute+ "/api/single-category/"; // + {id}
	public String update_category_by_id_route     = globalBackendRoute + "/api/update-category/"; // + {id}
	public String delete_category_by_id_route     = globalBackendRoute + "/api/delete-category/"; // + {id}
	public String get_category_count_route        = globalBackendRoute + "/api/category-count";
	public String get_category_product_counts     = globalBackendRoute + "/api/category-product-counts";
}