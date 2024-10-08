package scripts;

import org.testng.annotations.Test;

import generic.Excel;
import generic.OpenClose;
import pom.LoginPage;

public class OpenHomePage extends OpenClose
{
   // when the user enters the url (localhost:5173) 
	
	@Test
	public static void openHomePage()
	{
		LoginPage lp = new LoginPage();
		// expectedUrl http://localhost:5173/
		String expectedUrl = (String) Excel.getData("crm_sheet1", 0, 0);
		lp.verifyLoginPageUrl(expectedUrl);
	}
}
