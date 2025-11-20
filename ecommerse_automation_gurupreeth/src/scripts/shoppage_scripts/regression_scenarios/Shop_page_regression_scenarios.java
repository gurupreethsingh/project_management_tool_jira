package scripts.shoppage_scripts.regression_scenarios;

import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import generic.AllVerifications;
import generic.BaseClass_Anusha;
import generic.BaseClass_Anusha.Excel_Anusha;
import pom.ShopPage;

public class Shop_page_regression_scenarios extends BaseClass_Anusha
{
	SoftAssert sa = new SoftAssert();
	@Test(enabled = true, priority = 1)
	   public void openShoppageUsingUrl()
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
	   }
		
	@Test(enabled = true, priority = 2)
	   public void clickOnLogoFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			sp.clickOnlogoFromShopPage();
			
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",1,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
	
	@Test(enabled = true, priority = 3)
	   public void clickOnShopAllLinkTextFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			sp.clickOnShopAllLinkTextFromShopPage();
			
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
	@Test(enabled = true, priority = 4)
	   public void clickOnWishlistFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			sp.clickOnwishlistFromShopPage();
			
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",3,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
	@Test(enabled = true, priority = 5)
	   public void clickOnCartIconFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			sp.clickOnCartFromShopPage();
			
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
	@Test(enabled = true, priority = 6)
	   public void clickOnAvatarFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			sp.clickOnAvatarFromShopPage();
			
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",4,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
	
	@Test(enabled = true, priority = 7)
	   public void clickOnSignInFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			sp.clickOnSignInFromShopPage();
			
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",4,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
	@Test(enabled = true, priority = 8)
	   public void enterValueIntoSearchFieldFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			   sp.EnterValueInSearchField("pen");
			   sp.clickOnSearchButton();		
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",2,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
	@Test(enabled = true, priority = 9)
	   public void clickOnCardViewFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			sp.clickOnCardViewFromShopPage();
			
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
		
	@Test(enabled = true, priority = 10)
	   public void clickOnGridViewFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			sp.clickOnGridViewFromShopPage();
			
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
	@Test(enabled = true, priority = 11)
	   public void clickOnListViewFromShopPage() throws InterruptedException
	   {
			String expectedShoppageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedShoppageTitle, driver, sa);
			sa.assertAll();
			
			ShopPage sp = new ShopPage(driver);
			sp.clickOnListViewFromShopPage();
			
			
			String expectedHomepageTitle = (String)Excel_Anusha.getData("ShopPage",0,0);
			AllVerifications.verifyTitle(expectedHomepageTitle, driver, sa);
			sa.assertAll();
	   }
}
