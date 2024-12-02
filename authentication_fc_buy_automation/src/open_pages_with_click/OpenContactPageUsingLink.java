package open_pages_with_click;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class OpenContactPageUsingLink {

	public static void main(String[] args) throws InterruptedException
	{
		// open browser. 
				WebDriver driver = new ChromeDriver();
				driver.manage().window().maximize();
				driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
				// go to the website ., get the webpage. 
				driver.get("http://localhost:5173/");
				driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
				String actual_homepagetitle =  driver.getTitle();
				String expected_homepagetitle = "Ecoders - Homepage";
				
				if(actual_homepagetitle.equals(expected_homepagetitle))
				{
					System.out.println("Homepage is displayed");
					// find the about us button or link. 
					WebElement contact_us_link = driver.findElement(By.xpath("//a[@href='/contact-us']"));  
					contact_us_link.click();
					
					String contactpage_title = driver.getTitle();
					System.out.println("Contact page title is " + contactpage_title);
				}
				
				Thread.sleep(3000);
				driver.quit();
	}
}