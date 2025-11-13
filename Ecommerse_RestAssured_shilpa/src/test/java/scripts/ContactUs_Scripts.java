package scripts;

import org.testng.Assert;

import entity.ContactUs;
import io.restassured.response.Response;

public class ContactUs_Scripts {
	public void testAddingNewMessage()
	{
		/// Use entity classes's setter method to make new category name. 
		ContactUs c = new ContactUs();
		c.setsetCategory_name("Watches");
		
		Response res = CategoryEndpoints.addCategory(c);   // this creates the category
		res.then().log().all();
		Assert.assertEquals(res.getStatusCode(), 201, "Creating category failed, Api route not working.");
		
	}


}
