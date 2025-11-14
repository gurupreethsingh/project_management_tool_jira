package scripts.categoryScripts;

import org.testng.Assert;
import org.testng.annotations.Test;

import endpoints.CategoryEndpoints;
import io.restassured.response.Response;

public class FetchAllProductCounntInACategory 
{
	@Test
    public  static void testCountingOfAllProductsInACategory()
    {
    	Response res =  CategoryEndpoints.countAllProductsInACategory();
    	res.then().log().all();
    	Assert.assertEquals(res.getStatusCode(), 200, "Error fetching all product count in a category.");
    }
}
