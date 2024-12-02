package homepage__scenarios;
import java.time.Duration;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class FetchAllLinkinHomepage {

	public static void main(String[] args) throws InterruptedException {
		// open chrome browser. 
				WebDriver driver = new ChromeDriver();
				
				driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
				
				// enter the homepage url 
				driver.get("http://localhost:5173/");
				driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
				
				
				List<WebElement> alllinks = driver.findElements(By.tagName("a"));
				
				// print the ttotal links. size. 
				int count = alllinks.size();
				
				System.out.println("total links in the homepage are " + count);
				
				
//				for ( int i = 0; i< 34; i++)
//				{
//					String eachlinkstext = alllinks.get(i).getText();
//					System.out.println(eachlinkstext);
//					Thread.sleep(500);
//				}
				
				
				for ( int i = 0; i< 34; i++)
				{
					String eachlinksaddress = alllinks.get(i).getAttribute("href");
					System.out.println(eachlinksaddress);
					Thread.sleep(500);
				}
	}
}
