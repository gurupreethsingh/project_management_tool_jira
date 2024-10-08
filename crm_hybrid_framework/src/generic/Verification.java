package generic;

import java.io.File;
import java.time.Duration;
import java.util.Date;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Reporter;

import com.google.common.io.Files;

public class Verification 
{
	public static WebDriver driver;
	
	Verification(WebDriver driver){
		this.driver =  driver;
	}
	
	public static void verifyTitle(String expectedTitle)
	{
		WebDriverWait wait = new WebDriverWait(driver, 10);
		try
		{
			wait.until(ExpectedConditions.titleIs(expectedTitle));
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
			Reporter.log("Test case failed, Title didnot match");
			// screenshot. 
			TakesScreenshot ts = (TakesScreenshot)driver;
			
			File ramlocation = ts.getScreenshotAs(OutputType.FILE);
			String rootFolder = System.getProperty("user.dir");
			String screenshotfolder = rootFolder+"\\failed_Screenshots";
			Date d = new Date();
			File harddisklocation = new File(screenshotfolder+"\\image_"+d+".jpg");
			Files.copy(ramlocation, harddisklocation);
		}
	}
}