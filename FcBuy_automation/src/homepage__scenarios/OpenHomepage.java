package homepage__scenarios;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class OpenHomepage {

	public static void main(String[] args) throws InterruptedException
	{
       // open chrome browser. 
		WebDriver driver = new ChromeDriver();
		
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		
		// enter the homepage url 
		driver.get("http://localhost:5173/");
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		
		String actualTitle = driver.getTitle();
		System.out.println("the actual page title is ");
		System.out.println(actualTitle);
		
		// fetch the url as well .
		String actualUrl = driver.getCurrentUrl();
		System.out.println("The actual url of the page is ");
		System.out.println(actualUrl);
		
		Thread.sleep(3000);
		
		driver.quit();
	}
}
