package scripts.shoppage_scripts.functional_scenarios;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import generic.AllVerifications;
import generic.BaseClass_Anusha;
import pom.Homepage;
import pom.ShopPage;


public class AS_6328_clickOnEachCategoryOnShopPage extends BaseClass_Anusha 
{
SoftAssert sa = new SoftAssert();
	
	@Test(enabled = true, priority = 1)
   public void clickOnEachCategoryFromShopPage() throws InterruptedException
   {
		String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
		AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
		sa.assertAll();
		//verifying CATEGORIES haeding below clear filter button 
		String expectedText = "CATEGORIES";
		ShopPage sp = new ShopPage(driver);
		sp.verifyProductCategoryHeadingInShopPage(expectedText);
		
		sp.verifyNumberOfMainCategories();
		// not getting number of categories ------------> doubt
		
//		 List<WebElement> allCategoriesCount=driver.findElements(By.cssSelector("div.py-10>div>div.rounded-xl>div:nth-of-type(2)>div:nth-of-type(2)>div"));  //findElements-->multiple elements
//		 int allMainCategoryCount =allCategoriesCount.size();
//		 System.out.println("Total number of main categories  found:"+allMainCategoryCount);
	
		AllVerifications.textIsPresentOrNot(actualMainCategoryText, driver, null, sa)
		sp.verifyMainCategoryName();
		sp.clickOnMainCategoryFromShopPage();
		sp.clickOnMainCategoryDropDownFromShopPage();
		sp.clickONClearFilterButton();
			
   }
	
}
