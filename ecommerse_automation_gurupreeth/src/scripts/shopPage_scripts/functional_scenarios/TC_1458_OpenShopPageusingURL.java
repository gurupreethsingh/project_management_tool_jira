package scripts.shopPage_scripts.functional_scenarios;

import java.io.File;
import java.time.Duration;


import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import generic.AllVerifications;
import generic.AutomationConstants;
import generic.Excel;



 class OpenClose_Anusha implements AutomationConstants
{
	static String PATH_SHOP                = "/shop";
	static String URL_SHOP                 = URL_OF_APPLICATION + PATH_SHOP;
	String excelSheetPath = rootDirectory+File.separator+"project_documents_ANUSHA_shopPage.xlsx";
	String failedScreenshots = rootDirectory + File.separator + "failedScreenshots";
	public static WebDriver driver = null; 
	
	@BeforeMethod
	public static void openApplication()
	{
	    driver = new ChromeDriver(); 
	    driver.manage().window().maximize(); 
	    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
	    driver.get(URL_SHOP);
	    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
	}
	
	
	@AfterMethod
	public static void closeApplication()
	{
		driver.quit();
	}

}
public class TC_1458_OpenShopPageusingURL  extends OpenClose_Anusha{

		SoftAssert sa = new SoftAssert();
		
		@Test(enabled = true, priority = 1)
	   public void openShopPageusingURL()
	   {
			String expectedShopPageTitle = (String)Excel.getData("ShopPage",1,0);
			AllVerifications.verifyTitle(expectedShopPageTitle, driver, sa);
			sa.assertAll();
	   }

	}


