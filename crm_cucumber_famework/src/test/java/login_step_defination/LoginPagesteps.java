package login_step_defination;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import io.cucumber.java.en.Given;

public class LoginPagesteps 
{
	 WebDriver driver;
	@Given("When user enters login page url in chrome browser")
	public void when_user_enters_login_page_url_in_chrome_browser() {
	  driver=new ChromeDriver();
	  driver.get("http://localhost:5173/");
	    throw new io.cucumber.java.PendingException();
	}
}
