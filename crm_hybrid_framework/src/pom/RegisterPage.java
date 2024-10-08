package pom;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import generic.Verification;

public class RegisterPage extends Verification  // super, base, parent
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
	private WebElement registerPageTitle;
	
	@FindBy(xpath="(//h6)[1]")
	private WebElement registerFormTitle;
	
	@FindBy(xpath="(//label)[1]")
	private WebElement firstnameLabelText;
	
	@FindBy(xpath="(//label)[2]")
	private WebElement lastnameLabelText;
	
	@FindBy(xpath="(//label)[3]")
	private WebElement emailLabelText;
	
	@FindBy(xpath="(//label)[4]")
	private WebElement passwordLabelText;
	
	@FindBy(xpath="(//label)[5]")
	private WebElement phoneLabelText;
	
	@FindBy(xpath="(//label)[6]")
	private WebElement departmentLabelText;
	
	@FindBy(xpath="(//label)[7]")
	private WebElement positionLabelText;
	
	@FindBy(xpath="(//input)[1]")
	private WebElement firstnameInputField;
	
	@FindBy(xpath="(//input)[2]")
	private WebElement lastnameInputField;
	
	@FindBy(xpath="(//input)[3]")
	private WebElement emailInputField;
	
	@FindBy(xpath="(//input)[4]") 
	private WebElement passwordInputField;
	
	@FindBy(xpath="(//input)[5]")
	private WebElement phoneInputField;
	
	@FindBy(xpath="(//input)[6]")
	private WebElement departmentInputField;
	
	@FindBy(xpath="(//input)[7]")
	private WebElement positionInputField;
	
	@FindBy(xpath="//button[@type='submit']")
	private WebElement registerButton;
	
	public RegisterPage()
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
	
	public void getTextOfRegisterPageTitle()	{
		String registerpagetitletext = registerPageTitle.getText();
		System.out.println(registerpagetitletext);
	}
	
	public void getTextOfRegisterFormTitle()	{
		String registerFormTitletext = registerFormTitle.getText();
		System.out.println(registerFormTitletext);
	}
	
	public void getTextOfemailLabelText()	{
		String emailLabelTexttext = emailLabelText.getText();
		System.out.println(emailLabelTexttext);
	}
	
	public void getTextOfPasswordLabelText()	{
		String passwordLabeltext = passwordLabelText.getText();
		System.out.println(passwordLabeltext);
	}
	
	// entering 
	public void enterFirstName(String firstName)	{
		firstnameInputField.sendKeys(firstName);
	}
	
	public void enterLastName(String lastName)	{
		lastnameInputField.sendKeys(lastName);
	}
	
	public void enterEmail(String email)	{
		emailInputField.sendKeys(email);
	}
	
	public void enterPassword(String password)	{
		passwordInputField.sendKeys(password);
	}
	
	public void enterPhone(String phone)	{
		phoneInputField.sendKeys(phone);
	}
	
	public void enterDepartment(String department)	{
		departmentInputField.sendKeys(department);
	}
	
	public void enterPosition(String position)	{
		positionInputField.sendKeys(position);
	}
	
	public void clickOnRegisterButton()	{
		registerButton.click();
	}
	
	// verify the title of the login page. 
	public static void verifyRegisterPageTitle(String expectedTitle)
	{
		verifyTitle(expectedTitle);
	}
	
	public static void verifyRegisterPageUrl(String expectedUrl)
	{
		verifyUrl(expectedUrl);
	}
}
