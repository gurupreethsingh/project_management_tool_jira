package homepage_scenarios.functional_scenarios;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class AS_3354_Open_shoppage_click_shoplink_from_homepage 
{
	public static void main(String[] args) throws InterruptedException 
	{
       // 1. open browser and enter the homepage url.
		WebDriver driver = new ChromeDriver();
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		driver.get("http://localhost:5173");
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		
		// click on the first slider indicator button. 
		WebElement firstSliderIndicator = driver.findElement(By.cssSelector("div.carousel-indicators>button:first-child"));
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		firstSliderIndicator.click(); 
		Thread.sleep(1500);
		
		//Click on shop now button.
		WebElement showNowButton = driver.findElement(By.cssSelector("div.carousel-inner>div.carousel-item:nth-of-type(1)>div.carousel-caption>a.bg-orange-500"));
		Thread.sleep(1500);
		showNowButton.click();
		Thread.sleep(1000);
		// verify the shop page title and url (matching or not) 
		String expectedShopUrl = "http://localhost:5173/shop";
		String expectedShopTitle = "Shop | ECODERS";
		
		String actualShopPageUrl = driver.getCurrentUrl();
		System.out.println("The actual url is : " + actualShopPageUrl);
		String actualShopPageTitle = driver.getTitle();
		
		System.out.println("The actual title is : " + actualShopPageTitle);
		
		if(expectedShopTitle.equals(actualShopPageTitle))
		{
			System.out.println("Test case passed, title is matching.");
		}
		else
		{
			System.out.println("Test case failed, title is not matching.");
		}
		
	}
}
