package endpoints;

import static io.restassured.RestAssured.given;

import entity.ContactUs;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import routes.ContactUs_Routes;



public class ContactUs_Endpoints {
	
	 public static Response  addContact(ContactUs  c)
	   {
		 ContactUs_Routes routes =   new ContactUs_Routes();
		   
		   return  given()
				   .contentType(ContentType.JSON)
				   .accept(ContentType.JSON)
//				   .header("Authorization", "Bearer " + AuthToken.SUPER_ADMIN_TOKEN)
				   .body(c)
				   .when()
				   .post(routes.post_add_ContactMessage_Route);
	   }
	   

}
