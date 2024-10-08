package generic;

import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class OpenClose implements Constants
{
	public static WebDriver driver;
	
	@BeforeMethod
	public static void openApplication()
	{
	    driver = new ChromeDriver();
	    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		
		driver.get(urlOfApplication);
		 driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
	}

	@AfterMethod
	public static void closeApplication()
	{
		driver.quit();
	}
}