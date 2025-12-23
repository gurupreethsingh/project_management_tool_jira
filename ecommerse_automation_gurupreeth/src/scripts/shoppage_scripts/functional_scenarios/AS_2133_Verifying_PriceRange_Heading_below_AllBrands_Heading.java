package scripts.shoppage_scripts.functional_scenarios;

import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import generic.AllVerifications;
import generic.BaseClass_Anusha;
import generic.TakingScreenshot;
import pom.ShopPage;


public class AS_2283_Verifying_PriceRange_Heading_below_AllBrands_Heading extends BaseClass_Anusha 
{
SoftAssert sa = new SoftAssert();
	
	@Test(enabled = true, priority = 1)
   public void testVerifyingBrandsHeadingBelowCategoriesHeading()
   {
		String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
		AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
		sa.assertAll();
		
		String expectedText = "BRANDS";
		ShopPage sp = new ShopPage(driver);
		sp.verifyBrandsHeadingBelowCategoriesHeading(expectedText);
		TakingScreenshot.captureScreenshot(driver);
		
		
   }
	
}
