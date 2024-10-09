package sunil_code;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class OpenHomepage {

	public static void main(String[] args) throws InterruptedException 
	{
		// open chrome browser
		WebDriver driver = new ChromeDriver();
//		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		Thread.sleep(2000);
		
         // open the website homepage
		driver.get("http://localhost:5173");
		Thread.sleep(2000);
		
		String expectedUrl = "http://localhost:5173/";
		
		String actualUrl = driver.getCurrentUrl();
		
		if(expectedUrl.equals(actualUrl))
		{
			System.out.println("url is matching, Test case passed.");
		}
		else
		{
			System.out.println("url is not matching, Test case failed.");
		}
		
		driver.quit();

}
}
