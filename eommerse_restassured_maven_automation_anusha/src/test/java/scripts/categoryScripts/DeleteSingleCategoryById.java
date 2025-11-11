package scripts.categoryScripts;

import org.testng.Assert;
import org.testng.annotations.Test;

import endpoints.CategoryEndpoints;
import io.restassured.response.Response;

public class DeleteSingleCategoryById 
{
	@Test
	public void testDeleteSingleCategoryById()
	{
		Response res = CategoryEndpoints.deleteCategoryById("6913003e60063f0aeb81ca1e");
		res.then().log().all(); 
		Assert.assertEquals(res.getStatusCode(), 200, "Fetch category by id, failed");
	}

}
