package scripts.categoryScripts;

import org.testng.Assert;
import org.testng.annotations.Test;

import endpoints.CategoryEndpoints;
import entity.Category;
import io.restassured.response.Response;

public class CategoryScripts 
{
	// create a script to add a new category. 
	@Test
	public void testAddingNewCategory()
	{
		/// Use entity classes's setter method to make new category name. 
		Category c = new Category();
		c.setCategory_name("Watches");
		
		Response res = CategoryEndpoints.addCategory(c);   // this creates the category
		res.then().log().all();
		Assert.assertEquals(res.getStatusCode(), 201, "Creating category failed, Api route not working.");
		
	}

}
