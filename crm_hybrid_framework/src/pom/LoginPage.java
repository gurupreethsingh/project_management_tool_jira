package pom;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import generic.Verification;

public class LoginPage extends Verification  // super, base, parent
{
	public static WebDriver driver;
	
	// 1. find all the Webelements in your page.(private)
	// 2. initialize all the webelements. 
	// 3. make functions to perform actions in those web elements.
	
	@FindBy(xpath="//a[@class='navbar-brand text-secondary']")
	private WebElement ecodersLogo;
	
	@FindBy(xpath="//a[@class='nav-link']")
	private WebElement registerTab;
	
	@FindBy(xpath="//a[@class='btn btn-sm btn-outline-success me-2 ms-2']")
	private WebElement loginTab;
	
	@FindBy(xpath="(//h5)[1]")
	private WebElement loginPageTitle;
	
	@FindBy(xpath="(//h6)[1]")
	private WebElement loginFormTitle;
	
	@FindBy(xpath="(//label)[1]")
	private WebElement emailLabelText;
	
	@FindBy(xpath="//input[@type='email']")
	private WebElement emailInputField;
	
	@FindBy(xpath="(//label)[2]")
	private WebElement passwordLabelText;
	
	@FindBy(xpath="//input[@type='password']")
	private WebElement passwordInputField;
	
	@FindBy(xpath="//button[@type='submit']")
	private WebElement loginButton;
	
	public LoginPage()
	{
		super(driver);
		PageFactory.initElements(driver, this);
	}
	
	// create function to click on ecoders logo. 
	public void clickOnEcodersLogo()	{
		ecodersLogo.click();
	}
	
	public void clickOnRegisterTab()	{
		registerTab.click();
	}
	
	public void clickOnLoginTab()	{
		loginTab.click();
	}
	
	public void getTextOfloginPageTitle()	{
		String loginpagetitletext = loginPageTitle.getText();
		System.out.println(loginpagetitletext);
	}
	
	public void getTextOfloginFormTitle()	{
		String loginFormTitletext = loginFormTitle.getText();
		System.out.println(loginFormTitletext);
	}
	
	public void getTextOfemailLabelText()	{
		String emailLabelTexttext = emailLabelText.getText();
		System.out.println(emailLabelTexttext);
	}
	
	public void enterEmailId(String email)	{
		emailInputField.sendKeys(email);
	}
	
	public void getTextOfPasswordLabelText()	{
		String passwordLabeltext = passwordLabelText.getText();
		System.out.println(passwordLabeltext);
	}
	
	public void enterPassword(String password)	{
		passwordInputField.sendKeys(password);
	}
	
	public void clickOnLoginButton()	{
		loginButton.click();
	}
	
	// verify the title of the login page. 
	public static void verifyLoginPageTitle(String expectedTitle)
	{
		verifyTitle(expectedTitle);
	}
	
	public static void verifyLoginPageUrl(String expectedUrl)
	{
		verifyUrl(expectedUrl);
	}
}
