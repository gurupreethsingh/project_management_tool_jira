package scripts.contactus_scripts.functional_scenarios;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import generic.AllVerifications;
import generic.BaseClass_Shilpa;
import generic.BaseClass_Shilpa.Excel_Shilpa;
import pom.ContactUspage;

public class ET_2219_Reload_ContactUspage_click_Contact_Us_link extends BaseClass_Shilpa {
	SoftAssert sa = new SoftAssert();

	@Test(enabled = true, priority = 1)
	public void reloadContactpageClickContactLink() throws InterruptedException {
		String expectedContactpageTitle = (String) Excel_Shilpa.getData("ContactUspage", 1, 0);
		AllVerifications.verifyTitle(expectedContactpageTitle, driver, sa);
		ContactUspage cp = new ContactUspage(driver);

		WebElement footerContactLink = driver
				.findElement(By.cssSelector("div.grid.grid-cols-1.mb-12>div:first-child>ul>li:nth-of-type(2)"));
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].scrollIntoView(true);", footerContactLink);
		Thread.sleep(1000);

		sa.assertAll();
	}

}