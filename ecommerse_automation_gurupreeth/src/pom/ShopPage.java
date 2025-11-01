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
	
	
	@FindBy(css="section.mt-16>div:first-child>h2")
	private WebElement exploreProductsHeading;
	
	
	@FindBy(css = "div#brandProductsCarousel>div")
	private List<WebElement> bottomProductCount;
	
	
	// initializing all the elements in this page. using the constructor of this class. 
	public ShopPage(WebDriver driver)
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
	
	
	public void clickOnshopAllLink()
	{
		AllVerifications.clickIfVisibleAndEnabled(shopAllLink, driver, sa);
	}
	
	public void clickOnSignInLink()
	{
		AllVerifications.clickIfVisibleAndEnabled(signInLink, driver, sa);
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
	
	
	public void verifyexploreProductHeadingText()
	{
		AllVerifications.textIsPresentOrNot("Explore Products from Popular Brands", driver, exploreProductsHeading, sa);
		Actions actions=new Actions(driver);
		actions.scrollToElement(exploreProductsHeading).build().perform();
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
		 String Heading= exploreProductsHeading.getText();
		 System.out.println("Heading of the product section is : "+Heading);
		 driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
	}
	
	
	public int countAllProductText()
	{
		int allProductCount = 0; 
		 List<WebElement> allProduct= bottomProductCount ; //findElements-->multiple elements
		  allProductCount =allProduct.size();
		 System.out.println("Total number of products found:"+allProductCount);
		 
		 return allProductCount;
	}
	
	
	
}
