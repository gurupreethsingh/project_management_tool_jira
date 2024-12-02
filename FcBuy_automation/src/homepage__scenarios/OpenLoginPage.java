package homepage__scenarios;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class OpenLoginPage {

	public static void main(String[] args) throws InterruptedException {
		// open chrome browser. 
		WebDriver driver = new ChromeDriver();
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		// enter the homepage url 
		driver.get("http://localhost:5173/");
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		System.out.println("Home page title is");
		System.out.println(driver.getTitle());
		Thread.sleep(2000);
		// find the login link. 
		WebElement loginlink = driver.findElement(By.xpath("//a[@href='/login']"));
		loginlink.click();
		String actual_login_page_title = driver.getTitle();
		System.out.println("Login page title is");
		System.out.println(actual_login_page_title);
	}
}
