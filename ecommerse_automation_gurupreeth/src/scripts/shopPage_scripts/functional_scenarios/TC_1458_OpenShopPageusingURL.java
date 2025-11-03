package scripts.shopPage_scripts.functional_scenarios;

import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import generic.AllVerifications;
import generic.Excel;
import generic.OpenClose_shopPage;

public class TC_1458_OpenShopPageusingURL extends OpenClose_shopPage {

		SoftAssert sa = new SoftAssert();
		
		@Test(enabled = true, priority = 1)
	   public void openShopPageusingURL()
	   {
			String expectedShopPageTitle = (String)Excel.getData("ShopPage",1,0);
			AllVerifications.verifyTitle(expectedShopPageTitle, driver, sa);
			sa.assertAll();
	   }

	}


