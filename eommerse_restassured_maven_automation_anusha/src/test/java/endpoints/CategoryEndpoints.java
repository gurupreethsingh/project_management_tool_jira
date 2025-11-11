package endpoints;

import entity.Category;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import routes.AuthToken;
import routes.CategoryRoutes;

import static io.restassured.RestAssured.given;

public class CategoryEndpoints 
{
   public static Response  addCategory(Category  newCategoryDetails)
   {
	   CategoryRoutes routes =   new CategoryRoutes();
	   
	   return  given()
			   .contentType(ContentType.JSON)
			   .accept(ContentType.JSON)
			   .header("Authorization", "Bearer " + AuthToken.SUPER_ADMIN_TOKEN)
			   .body(newCategoryDetails)
			   .when()
			   .post(routes.post_add_category_route);
   }
   
   
   public static Response fetchAllCategories()
   {
	   CategoryRoutes routes =   new CategoryRoutes();
	   
	   return  given()
			   .header("Authorization", "Bearer " + AuthToken.SUPER_ADMIN_TOKEN)
			   .when()
			   .get(routes.get_all_categories_route);
   }
   
   public static Response fetchOneCategoryById(String id)
   {
	   CategoryRoutes routes =   new CategoryRoutes();
	   
	   return  given()
			   .header("Authorization", "Bearer " + AuthToken.SUPER_ADMIN_TOKEN)
			   .when()
			   .get(routes.get_category_by_id_route + id);
   }
   
   public static Response deleteCategoryById(String id)
   {
	   CategoryRoutes routes =   new CategoryRoutes();
	   
	   return  given()
			   .header("Authorization", "Bearer " + AuthToken.SUPER_ADMIN_TOKEN)
			   .when()
			   .delete(routes.delete_category_by_id_route + id);
   }
   
   public static Response updateCategoryById(String id, Category  newCategoryDetails)
   {
	   CategoryRoutes routes =   new CategoryRoutes();
	   
	   return  given()
			   .header("Authorization", "Bearer " + AuthToken.SUPER_ADMIN_TOKEN)
			   .contentType(ContentType.JSON).accept(ContentType.JSON)
			   .body(newCategoryDetails)
			   .when()
			   .put(routes.update_category_by_id_route + id);
   }
   
   public static Response countAllCategories()
   {
	   CategoryRoutes routes =   new CategoryRoutes();
	   
	   return  given()
			   .header("Authorization", "Bearer " + AuthToken.SUPER_ADMIN_TOKEN)
			   .when()
			   .get(routes.get_category_count_route);
   }
   
   public static Response countAllProductsInACategory()
   {
	   CategoryRoutes routes =   new CategoryRoutes();
	   
	   return  given()
			   .header("Authorization", "Bearer " + AuthToken.SUPER_ADMIN_TOKEN)
			   .when()
			   .get(routes.get_category_product_counts);
   }
   
   
   
}
