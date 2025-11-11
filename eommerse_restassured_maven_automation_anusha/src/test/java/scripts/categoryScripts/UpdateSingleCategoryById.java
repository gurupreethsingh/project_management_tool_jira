package scripts.categoryScripts;

import org.testng.Assert;
import org.testng.annotations.Test;

import endpoints.CategoryEndpoints;
import entity.Category;
import io.restassured.response.Response;

public class UpdateSingleCategoryById 
{
	@Test
	public void testUpdateSingleCategoryById()
	{
		Category c = new Category();
		c.setCategory_name("Mens Watch");
		
		Response res = CategoryEndpoints.updateCategoryById("6913003e60063f0aeb81ca1e", c);
		res.then().log().all(); 
		Assert.assertEquals(res.getStatusCode(), 200, "Update category by id, failed");
	}

}
