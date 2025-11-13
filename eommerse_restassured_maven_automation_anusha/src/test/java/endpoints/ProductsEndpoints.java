package endpoints;
import static io.restassured.RestAssured.given;

import entity.Product;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import routes.AuthToken;
import routes.ProductRoutes;
public class ProductsEndpoints 
{
  public static Response addProduct(Product newProductDetails)
  {
	  ProductRoutes routes =new ProductRoutes();
	  
	  return given()
			  .contentType(ContentType.JSON)
	          .accept(ContentType.JSON)
	          .header("Authorization", "Bearer " + AuthToken.SUPER_ADMIN_TOKEN)
	          .body(newProductDetails)
	          .when()
	          .post(routes.post_add_product_route);
  }
//  public static Response fetchAllAddedProducts()
//  {
//	  ProductRoutes routes =new ProductRoutes();
//	  return given()
//			  .contentType(ContentType.JSON)
//			  .accept(ContentType.JSON)
//			  .when()
//			  .get(routes.get_all_added_products);
//  }
}
