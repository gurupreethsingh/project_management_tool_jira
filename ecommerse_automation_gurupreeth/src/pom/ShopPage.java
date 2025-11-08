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

public class ShopPage extends AllVerifications
{
	public WebDriver driver =null; 
	SoftAssert sa = new SoftAssert();
	
	// finding your weblements 
	
	
	@FindBy(css = "div.grid>div.relative:nth-of-type(2)>div.p-4>div.pt-3>button")
	private WebElement addToCartButton;
	
	
	@FindBy(css = "div.hidden.items-center.gap-6>div.relative>button")
	private WebElement cartIcon;
	
	@FindBy(css = "div.grid>div.relative:nth-of-type(2)>div.p-4>h3")
	private WebElement productNameInProductCard;
	
	
	@FindBy(css = "div.overflow-y-auto>div:nth-of-type(1)>div.flex-grow>h3")
	private WebElement productNameInMiniCart;
	
	
	@FindBy(css = "div.mt-4.border-t>a")
	private WebElement viewCartButtonInMiniCart;
	
	
	@FindBy(css="input.flex-grow")
	private WebElement searchField;
	
	@FindBy(css="div.hidden.justify-center>form>button")
	private WebElement searchIcon;
	
	
	@FindBy(css="h1.text-3xl")
	private WebElement headingInSearchField;
	
	
	
	
	
	// initializing all the elements in this page. using the constructor of this class. 
	public ShopPage(WebDriver driver)
	{
		super(driver);
		this.driver = driver; 
		PageFactory.initElements(driver, this);
	}
	
	
	// utilization (create fucntions to perform operations on elements ) 
	public void clickOnAddToCartButton()
	{
		AllVerifications.clickIfVisibleAndEnabled(addToCartButton, driver, sa);
	}
	
	public void clickOnCartIcon()
	{
		AllVerifications.clickIfVisibleAndEnabled(cartIcon, driver, sa);
	}
	
	public void verifyProductNameInMinicart(String expectedText)
	{
		AllVerifications.textIsPresentOrNot(expectedText, driver,  productNameInMiniCart, sa);
	}
	
	
	public String  verifyProductName()
	{
		String actualProductText  =  productNameInProductCard.getText();
		return  actualProductText;
	}
	
	
	public void clickOnViewCartButtonOFMiniCart()
	{
		AllVerifications.clickIfVisibleAndEnabled(viewCartButtonInMiniCart, driver, sa);
	}
	
	public void enterValueInSearchField1(String keys)
	{
		AllVerifications.clickIfVisibleAndEnabled(searchField, driver, sa);
		searchField.clear();
		searchField.sendKeys(keys);
	}
	
	
	public void clickOnSearchButton1()
	{
		AllVerifications.clickIfVisibleAndEnabled(searchIcon, driver, sa);
	}
	
	public void verifyProductNameInSearchProductPage(String expectedText)
	{
		AllVerifications.textIsPresentOrNotIgnoreCase(expectedText, driver,By.cssSelector("h1.text-3xl"), sa);
	}
	
	
	
	
	 
	
}
