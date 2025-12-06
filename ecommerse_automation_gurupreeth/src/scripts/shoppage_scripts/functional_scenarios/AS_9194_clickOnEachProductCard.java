package scripts.shoppage_scripts.functional_scenarios;

import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import generic.AllVerifications;
import generic.BaseClass_Anusha;
import pom.ShopPage;


public class AS_9194_clickOnEachProductCard extends BaseClass_Anusha 
{
SoftAssert sa = new SoftAssert();
	
	@Test(enabled = true, priority = 1)
   public void clickOnEachProductCard() throws InterruptedException
   {
		String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
		AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
		sa.assertAll();
		
		ShopPage sp = new ShopPage(driver);
		//sp.clickOnEachProductCards();
		
//		String expectedSingleProductpageTitle = (String)Excel_Anusha.getData("ShopPage",0,5);
//		AllVerifications.verifyTitle(expectedSingleProductpageTitle, driver, sa);
//		sa.assertAll();
		sp.clickOnEachProductCardsOnSecondPage();
//		sp.clickOnEachProductCardsOnThirdPage();
   }
	
}
