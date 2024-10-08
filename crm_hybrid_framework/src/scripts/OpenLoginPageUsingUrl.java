package scripts;

import org.testng.annotations.Test;

import generic.Excel;
import generic.OpenClose;
import pom.LoginPage;

public class OpenLoginPageUsingUrl extends OpenClose
{
	@Test
	public static void openHomePage() throws InterruptedException
	{
		LoginPage lp = new LoginPage();
		// expectedUrl http://localhost:5173/
		String expectedUrl = (String) Excel.getData("crm_sheet1", 0, 0);
		lp.verifyLoginPageUrl(expectedUrl);
		
		Thread.sleep(1000);
		
		String expectedLoginUrl = (String) Excel.getData("crm_sheet1", 1, 0);
		driver.navigate().to(expectedLoginUrl);
		lp.verifyLoginPageUrl(expectedLoginUrl);
		
	}
}
