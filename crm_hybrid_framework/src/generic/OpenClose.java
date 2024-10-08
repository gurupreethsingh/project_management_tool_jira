package generic;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public abstract class OpenClose implements Constants
{
	public static WebDriver driver;
	
	public static void openApplication()
	{
	    driver = new ChromeDriver();
	    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		
		driver.get(urlOfApplication);
		 driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
	}

	public static void closeApplication()
	{
		driver.quit();
	}
}