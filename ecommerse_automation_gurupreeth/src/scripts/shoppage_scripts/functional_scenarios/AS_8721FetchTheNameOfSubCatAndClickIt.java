package scripts.shoppage_scripts.functional_scenarios;

import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import generic.AllVerifications;
import generic.BaseClass_Anusha;
import pom.ShopPage;

public class AS_8721FetchTheNameOfSubCatAndClickIt extends BaseClass_Anusha
{
	SoftAssert sa = new SoftAssert();
		
	@Test(enabled = true, priority = 1)
	public void testClickOnMainCategoryDropDown() throws InterruptedException
	{
		String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
		AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
		sa.assertAll();
		
		ShopPage sp = new ShopPage(driver);
		int totalCategories=sp.findTotalCategoryCount(); 
		int totalSubCategories=sp.countNumberOfSubCategoriesOfThatMainCategory();
		for(int k=1;k<=totalCategories;k++) 
		{
			sp.clickOnDropDownOfMainCategory(k);
			 sp.countNumberOfSubCategoriesOfThatMainCategory();
		
			for(int p=1;p<=totalSubCategories;p++) 
			{
				sp.fetchTheNameOfSubCatAndClick(p);
			}
			
		}
		
		
		
		
}
}
