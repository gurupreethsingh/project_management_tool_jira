package scripts;

import java.io.IOException;
import org.testng.annotations.Test;
import generic.Excel;
import generic.OpenClose;
import pom.LoginPage;

public class OpenLoginPageUsingUrl extends OpenClose
{
	@Test
	public  void openHomePage() throws InterruptedException, IOException
	{
		LoginPage lp = new LoginPage(driver);
		// expectedUrl http://localhost:5173/
		String expectedUrl = (String) Excel.getData("crm_sheet1", 0, 0);
		lp.verifyLoginPageUrl(expectedUrl);
		
		Thread.sleep(4000);
		
		String expectedLoginUrl = (String) Excel.getData("crm_sheet1", 1, 0);
		driver.navigate().to(expectedLoginUrl);
		lp.verifyLoginPageUrl(expectedLoginUrl);
		Thread.sleep(4000);
		
	}
}
