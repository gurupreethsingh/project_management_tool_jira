package scripts.categoryScripts;

import org.testng.Assert;
import org.testng.annotations.Test;

import endpoints.CategoryEndpoints;
import io.restassured.response.Response;

public class FetchAllCategoriesCount 
{
	@Test
    public  static void testCountingAllCategories()
    {
    	Response res =  CategoryEndpoints.countAllCategories();
    	res.then().log().all();
    	Assert.assertEquals(res.getStatusCode(), 200, "Error fetching category count");
    }
}
