package pom;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.testng.asserts.SoftAssert;

import generic.AllVerifications;

public class ContactUspage extends AllVerifications
{
	public WebDriver driver =null; 
	SoftAssert sa = new SoftAssert();
	
	// finding your weblements 
	@FindBy(css = "nav>div.flex:first-child>a:first-child")
   private WebElement logo;
	
	@FindBy(css = "div.animate__fadeInUp>a.inline-block")
	private WebElement shopAllLink;
	
	@FindBy(css="div.hidden.items-center.gap-6>a:first-child")
	private WebElement wishListIcon;
	
	@FindBy(css="a.flex:last-child>span")
	private WebElement signInLink;
	
	@FindBy(css="input.flex-grow")
	private WebElement searchField;
	
	@FindBy(css="button.px-4")
	private WebElement searchIcon;
	
	
	
	
	//CONTACT US PAGE  elements
	
	@FindBy(xpath="//input[@id='firstName']")
	private WebElement firstNameField;
	
	@FindBy(xpath="//input[@id='lastName']")
	private WebElement lastNameField;
	
	@FindBy(xpath="//input[@id='email']")
	private WebElement emailField;
	
	@FindBy(xpath="//input[@id='phone']")
	private WebElement phoneField;
	
	@FindBy(xpath="//textarea[@id='message_text']")
	private WebElement yourMessageArea;
	
	
	@FindBy(css="button.bg-red-500")
	private WebElement submitForm;

	
	
	// initializing all the elements in this page. using the constructor of this class. 
	public ContactUspage(WebDriver driver)
	{
		super(driver);
		this.driver = driver; 
		PageFactory.initElements(driver, this);
	}
	
	
	// utilization (create fucntions to perform operations on elements ) 
	public void clickOnLogo()
	{
		AllVerifications.clickIfVisibleAndEnabled(logo, driver, sa);
	}
	
	
	public void enterValueInFirstNameField(String firstNamekeys)
	{
		
		AllVerifications.clickIfVisibleAndEnabled(firstNameField, driver, sa);
		firstNameField.clear();
		firstNameField.sendKeys(firstNamekeys);

	}
	
	public void enterValueInLastNameField(String lastNamekeys) throws InterruptedException
	{
		
		AllVerifications.clickIfVisibleAndEnabled(lastNameField, driver, sa);
		lastNameField.clear();
		lastNameField.sendKeys(lastNamekeys);
		Thread.sleep(1000);

	}
	
	
	public void enterValueInEmailField(String emailkeys) throws InterruptedException
	{
		
		AllVerifications.clickIfVisibleAndEnabled(emailField, driver, sa);
		emailField.clear();
		Thread.sleep(1000);
		emailField.sendKeys(emailkeys);
		Thread.sleep(1000);
	}
	
	public void enterValueInPhoneField(String phoneNumFromExcel) throws InterruptedException
	{
		
		AllVerifications.clickIfVisibleAndEnabled(phoneField, driver, sa);
		phoneField.clear();
		Thread.sleep(1000);
		phoneField.sendKeys(phoneNumFromExcel);
		Thread.sleep(1000);
	}
	
	public static String toPlainString(Object v) {
	    if (v == null) return "";
	    if (v instanceof String) return ((String) v).trim();
	    if (v instanceof Double) {
	        java.math.BigDecimal bd = java.math.BigDecimal.valueOf((Double) v);
	        return bd.stripTrailingZeros().toPlainString();
	    }
	    return v.toString().trim();
	}
	
	// (Optional) If you want to keep a convenience overload:
	public void enterValueInPhoneField(Object phone) throws InterruptedException {
	    enterValueInPhoneField(toPlainString(phone));
	}
	
	
	public void enterValueInMessageAreaField(String messagekeys) throws InterruptedException
	{
		
		AllVerifications.clickIfVisibleAndEnabled(yourMessageArea, driver, sa);
		yourMessageArea.clear();
		Thread.sleep(1000);
		yourMessageArea.sendKeys(messagekeys);
		Thread.sleep(1000);
	}
	
	public void clickOnSubmitForm() throws InterruptedException
	{
		AllVerifications.clickIfVisibleAndEnabled(submitForm, driver, sa);
		
		Thread.sleep(1000);
		
		
	}
	
	
	
	
	
	
	
	
	
	
	
	public void enterValueInSearchField(String keys)
	{
		AllVerifications.clickIfVisibleAndEnabled(searchField, driver, sa);
		searchField.clear();
		searchField.sendKeys(keys);
	}
	
	
	public void clickOnSearchButton()
	{
		AllVerifications.clickIfVisibleAndEnabled(searchIcon, driver, sa);
	}
	
	
	public void clickOnwishListIcon() throws InterruptedException
	{
		Thread.sleep(1000);
		AllVerifications.clickIfVisibleAndEnabled(wishListIcon, driver, sa);
		Thread.sleep(1000);
	}
	
	


	
	


	
	
}
