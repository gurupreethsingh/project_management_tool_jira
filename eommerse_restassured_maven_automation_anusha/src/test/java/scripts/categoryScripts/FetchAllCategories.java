package scripts.categoryScripts;

import org.testng.Assert;
import org.testng.annotations.Test;

import endpoints.CategoryEndpoints;
import io.restassured.response.Response;

public class FetchAllCategories 
{
	@Test
    public  static void testFetchingAllCategoryNames()
    {
    	Response res =  CategoryEndpoints.fetchAllCategories();
    	res.then().log().all();
    	Assert.assertEquals(res.getStatusCode(), 200, "Error fetching categories");
    }
}
