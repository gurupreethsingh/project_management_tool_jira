package scripts.categoryScripts;

import org.testng.Assert;
import org.testng.annotations.Test;

import endpoints.CategoryEndpoints;
import io.restassured.response.Response;

public class FetchSingleCategoryById 
{
	@Test
	public void testFetchSingleCategoryById()
	{
		Response res = CategoryEndpoints.fetchOneCategoryById("6811d1a1a5cbb3bc5bc3b672");
		res.then().log().all(); 
		Assert.assertEquals(res.getStatusCode(), 200, "Fetch category by id, failed");
	}

}
