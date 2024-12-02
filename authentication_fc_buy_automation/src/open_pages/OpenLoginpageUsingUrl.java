package open_pages;
import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class OpenLoginpageUsingUrl {

	public static void main(String[] args) throws InterruptedException // jvm 
	{
		// open browser. 
		WebDriver driver = new ChromeDriver();
		driver.manage().window().maximize();
		
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		
		// go to the website ., get the webpage. 
		driver.get("http://localhost:5173/login");
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		
		String loginpage_title = driver.getTitle();
		
		System.out.println(loginpage_title);
		System.out.println("\n**************************************************\n");
		
		System.out.println(driver.getCurrentUrl());
		
		System.out.println("\n**************************************************\n");
		
		System.out.println("Whole page code");
		
		System.out.println("\n**************************************************\n");
		System.out.println(driver.getPageSource());
		Thread.sleep(3000);
		driver.quit();
	}
}
