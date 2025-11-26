package pom;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
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
	
	@FindBy(css = "h1.text-3xl")
	private WebElement headingInSearchField;
	//
	
	@FindBy(css = "div.space-y-6>div:nth-of-type(2)>div.flex")
	private WebElement CategoriesHeadingBelowClearFilterButton;
	
	@FindBy(css = "nav.containerWidth>div.flex:first-child>a.linkText")
	private WebElement shopAllLinkText;
	
	@FindBy(css = "div.hidden>div.relative:nth-of-type(1)>button>svg")
	private WebElement cartIcon;
	
	@FindBy(css = "div.grid>div.relative:nth-of-type(2)>div.p-4>h3")
	private WebElement productNameInProductCard;
	
	@FindBy(css = "div.overflow-y-auto>div:nth-of-type(1)>div.flex-grow>h3")
	private WebElement productNameInMiniCart;
	
	@FindBy(css = "div.mt-4.border-t>a")
	private WebElement viewCartButtonInMiniCart;
	
	@FindBy(css = "div.mt-4.border-t>button.w-full")
	private WebElement checkoutButtonInMiniCart;
	
	@FindBy(css = "div.mt-4.border-t>div.flex")
	private WebElement totalPriceInMinicart;
	
	@FindBy(css="input.flex-grow")
	private WebElement searchField;
	
	@FindBy(css="div.hidden.justify-center>form>button")
	private WebElement searchIcon;
	
	@FindBy(css="h1.text-3xl")
	private WebElement headingOfProductInSearchProductPage;
	
	@FindBy(css="nav.containerWidth>div:nth-of-type(3)>a.relative")
	private WebElement wishlistIconFromShopPage;
	
	@FindBy(css="div.bg-gradient-to-r")
	private WebElement avatarTabFromShopPage;
	
	@FindBy(css="a.flex:last-child>span")
	private WebElement SignInLinkText;
	
	@FindBy(css="svg.text-cyan-500")
	private WebElement logoFromShopPage;
		
	@FindBy(css="div.space-y-6>div.flex>button")
	private WebElement clearFilterButton;
	
	
	@FindBy(css="div.py-10>div>div.rounded-xl>div:nth-of-type(2)>div:nth-of-type(2)>div")
	private List<WebElement> mainCategoryName;
	
	@FindBy(css="div.grid-cols-1.gap-6>div.relative")
	private List<WebElement> allProductContainer;


	
//	@FindBy(css="div.py-10>div>div.rounded-xl>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-child(1)>div>span:first-child")
//	private WebElement mainCategories;
	
	// there are 12 main category drop down 
	@FindBy(css="div.py-10>div>div.rounded-xl>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-child(1)>div>span:last-child")
	private WebElement DropDownOfMainCategories;
	
	//there is 4 sub category in first main category 
	@FindBy(css="div.pl-4>div.text-sm")
	private List<WebElement> subCategoriesOfFirstMainCategoryContainer;
	
	//there is 3 sub category in second main category 
	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
	private WebElement SubCategoriesOfsecondMainCategory;
	
	//there is 2 sub category in second main category 
	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
	private WebElement SubCategoriesOfThirdMainCategory;
	
	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
	private WebElement SubCategoriesOfFourthMainCategory;
	
	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
	private WebElement SubCategoriesOfFivthMainCategory;
	
//	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
//	private WebElement SubCategoriesOfSixthMainCategory;

	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
	private WebElement SubCategoriesOfSeventhMainCategory;
	
//	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
//	private WebElement SubCategoriesOfEightMainCategory;
//	
//	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
//	private WebElement SubCategoriesOfNingthMainCategory;
	
	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
	private WebElement SubCategoriesOfTenthMainCategory;
	
	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
	private WebElement SubCategoriesOfEleventhMainCategory;
	
	@FindBy(css="div.pl-4>div.text-sm:nth-of-type(1)")
	private WebElement SubCategoriesOfTwelthMainCategory;
	//div.space-y-6>div:nth-of-type(3)>div:last-child>div>span
	
	@FindBy(css="div.space-y-6>div:nth-of-type(3)>div.flex")
	private WebElement brandsHeadingBelowCategoriesHeading;
	
	@FindBy(css="div.space-y-6>div:nth-of-type(3)>div:last-child>div>span")
	private WebElement allBrandsLinkBelowBrandsHeading;
	
	@FindBy(css="div.space-y-6>div:nth-of-type(3)>div:last-child>div>svg")
	private WebElement dropDownOfAllBrandsBelowToBrandsHeading;
	
	@FindBy(css="div.space-y-6>div:nth-of-type(3)>div:last-child>div:last-child>div.flex:nth-of-type("+"i"+")>span")
	private WebElement brandsNameInAllBrands;
	
	@FindBy(css="div.space-y-6>div:nth-of-type(3)>div:last-child>div:last-child>div.flex>input")
	private List<WebElement> checkBoxesOfBrands_Container;
	
	@FindBy(css="div.space-y-6>div:nth-of-type(4)>div:first-child")
	private WebElement priceRangeHeadingBelowAllBrands;
	
	@FindBy(css="div.space-y-6>div:nth-of-type(4)>div:last-child>span>span:nth-of-type(2)")
	private WebElement leftPriceRangeButton;
	
	@FindBy(css="div.space-y-6>div:nth-of-type(4)>div:last-child>span>span:nth-of-type(3)")
	private WebElement rightPriceRangeButton;
	
	@FindBy(css="div.px-2>div.text-sm")
	private WebElement realPriceBelowPriceRange;
	
	@FindBy(css="div.space-y-6>div:nth-of-type(2)>div.flex")
	private WebElement categoriesHeading;

	@FindBy(css="div.space-y-6>div:nth-of-type(5)>div:first-child")
	private WebElement sortByHeadingBelowPriceRange;

	@FindBy(css="div.space-y-6>div:nth-of-type(5)>div:last-child>button:nth-of-type(1)")
	private WebElement defaultButtonBelongsToSortByHeading;

	@FindBy(css="div.space-y-6>div:nth-of-type(5)>div:last-child>button:nth-of-type(2)")
	private WebElement priceIncreaseBelongsToSortByHeading;

	@FindBy(css="div.space-y-6>div:nth-of-type(5)>div:last-child>button:nth-of-type(3)")
	private WebElement priceDecreaseBelongsToSortByHeading;

	@FindBy(css="div.space-y-6>div:nth-of-type(5)>div:last-child>button:nth-of-type(4)")
	private WebElement newestButtonBelongsToSortByHeading;

	@FindBy(css="div.space-y-6>div:nth-of-type(5)>div:last-child>button:nth-of-type(5)")
	private WebElement oldestButtonBelongsToSortByHeading;

	@FindBy(css="div.space-y-6>div:nth-of-type(5)>div:last-child>button:nth-of-type(6)")
	private WebElement popularButtonBelongsToSortByHeading;
	
	@FindBy(css="div.mb-6>h1")
	private WebElement ourProductsHeadingOnShopPage;
	
	@FindBy(css="div.grid:last-child>div.relative:nth-of-type("+"i"+")")
	private WebElement eachProductCards;
	//div.grid:last-child>div.relative:nth-of-type(1)>button
	
	@FindBy(css="div.grid:last-child>div.relative:nth-of-type("+"i"+")>button")
	private WebElement wishlistIconOnEachProductCards;
	
	@FindBy(css="div.grid>div.relative:nth-of-type(1)>div.p-4>div.flex>span:first-child")
	private WebElement priceOnProductCardsInShopPage;
	
	@FindBy(css="div.mb-6>div>div>button:nth-of-type(1)")
	private WebElement firstCardView;
	
	@FindBy(css="div.mb-6>div>div>button:nth-of-type(2)")
	private WebElement secondCardView;
	
	@FindBy(css="div.mb-6>div>div>button:nth-of-type(3)")
	private WebElement thirdCardView;
	
	@FindBy(css="div.mb-6>div>span")
	private WebElement productCount;
	
	@FindBy(css="div.mt-10>div>nav>button:nth-of-type(1)")
	private WebElement firstPaginationButton;
	
	@FindBy(css="div.mt-10>div>nav>button:nth-of-type(2)")
	private WebElement secondPaginationButton;
	
	@FindBy(css="div.mt-10>div>nav>button:nth-of-type(3)")
	private WebElement thirdPaginationButton;
	
	@FindBy(css="div.mb-12>div:nth-of-type(1)>ul>li:nth-of-type(1)>a")
	private WebElement aboutUs;
	
	@FindBy(css="hdiv.mb-12>div:nth-of-type(1)>ul>li:nth-of-type(2)>a")
	private WebElement contactUs;
	
	@FindBy(css="div.mb-12>div:nth-of-type(1)>ul>li:nth-of-type(3)>a")
	private WebElement careers;
	
	@FindBy(css="div.mb-12>div:nth-of-type(1)>ul>li:nth-of-type(4)>a")
	private WebElement blogs;
	
	@FindBy(css="div.mb-12>div:nth-of-type(2)>ul>li:nth-of-type(1)>a")
	private WebElement helpCenter;
	
	@FindBy(css="div.mb-12>div:nth-of-type(2)>ul>li:nth-of-type(2)>a")
	private WebElement privacyPolicy;
	
	@FindBy(css="div.mb-12>div:nth-of-type(2)>ul>li:nth-of-type(3)>a")
	private WebElement termsOfService;
	
	@FindBy(css="div.mb-12>div:nth-of-type(3)>div>a:nth-of-type(1)>svg")
	private WebElement faceBook;
	
	@FindBy(css="div.mb-12>div:nth-of-type(3)>div>a:nth-of-type(2)>svg")
	private WebElement twitter;
	
	@FindBy(css="div.mb-12>div:nth-of-type(3)>div>a:nth-of-type(4)>svg")
	private WebElement linkedIn;
	
	@FindBy(css="div.mb-12>div:nth-of-type(3)>div>a:nth-of-type(3)>svg")
	private WebElement gitHub;
	
	@FindBy(css="div.mb-12>div:nth-of-type(4)>form>input")
	private WebElement enterEmailField;
	
	@FindBy(css="div.mb-12>div:nth-of-type(4)>form>button")
	private WebElement subscribeButton;
	
	@FindBy(css="div.mb-12>div:nth-of-type(1)>h3")
	private WebElement companyHeading;
	
	@FindBy(css="div.mb-12>div:nth-of-type(2)>h3")
	private WebElement supportHeading;
	
	@FindBy(css="div.mb-12>div:nth-of-type(3)>h3")
	private WebElement followUs;
	
	@FindBy(css="div.mb-12>div:nth-of-type(4)>h3")
	private WebElement subscribeHeading;
	
	@FindBy(css="button.fixed")
	private WebElement topUpArrowButtonInFooter;
	
	@FindBy(css="div.border-t>p.text-sm:first-child")
	private WebElement copyWriteTextLeftSide;
	
	@FindBy(css="div.border-t>p.text-sm:last-child")
	private WebElement copyWriteTextRightSide;
	
	@FindBy(css="div>h1")
	private WebElement productHeadingInSingleProductPage;
	
	@FindBy(css="header>nav>div:nth-child(3)>a>div>span")
	private WebElement wishlistBadge;
	
	@FindBy(css="header>nav>div:nth-child(3)>div:nth-of-type(1)>button>span")
	private WebElement miniCartBadge;
	
	@FindBy(css="div.mt-4>button ")
	private WebElement checkOutButtonOnMinicart;
	
	@FindBy(css="h1.text-3xl")
	private WebElement removeButtonFromWishlistPage;
	
	@FindBy(css="div.transition:nth-of-type(1)>div.mt-4:nth-of-type(1)>h2")
	private WebElement productNameInWishlistPage;
	
	@FindBy(css="div.transition:nth-of-type(1)>div.mt-4:nth-of-type(1)>p:nth-of-type(1)")
	private WebElement productPriceInWishlistPage;
	
	
		
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// initializing all the elements in this page. using the constructor of this class. 
	public ShopPage(WebDriver driver)
	{
		super(driver);
		this.driver = driver; 
		PageFactory.initElements(driver, this);
	}
	
	
	// utilization (create fucntions to perform operations on elements ) 
	//
	public void clickOnlogoFromShopPage() throws InterruptedException
	{
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled(logoFromShopPage, driver, sa);
		Thread.sleep(2000);
	}
	public void clickOnShopAllLinkTextFromShopPage() throws InterruptedException
	{
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled(shopAllLinkText, driver, sa);
		Thread.sleep(2000);
	}
	
	
	
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


	public void clickOnwishlistFromShopPage() throws InterruptedException {
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled(wishlistIconFromShopPage, driver, sa);
		Thread.sleep(2000);
		
	}


	public void clickOnCartFromShopPage() throws InterruptedException 
	{
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled(cartIcon, driver, sa);
		Thread.sleep(2000);		
		
	}


	public void clickOnAvatarFromShopPage() throws InterruptedException 
	{
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled(avatarTabFromShopPage, driver, sa);
		Thread.sleep(2000);		
		
	}


	public void clickOnSignInFromShopPage() throws InterruptedException {
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled(SignInLinkText, driver, sa);
		Thread.sleep(2000);		
		
	}


	public void EnterValueInSearchField(String keys) {
		AllVerifications.clickIfVisibleAndEnabled(searchField, driver, sa);
		searchField.clear();
		searchField.sendKeys(keys);
	}
	
	public void clickOnSearchButton()
	{
		AllVerifications.clickIfVisibleAndEnabled(searchIcon, driver, sa);
	}
	public void verifyProductNameInSearchProductPage(String expectedText)
	{
		
		AllVerifications.textIsPresentOrNot(expectedText, driver,headingInSearchField, sa);
	}


	public void clickOnCardViewFromShopPage() throws InterruptedException 
	{
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled( firstCardView, driver, sa);
		Thread.sleep(2000);	
		
	}


	public void clickOnGridViewFromShopPage() throws InterruptedException {
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled( secondCardView, driver, sa);
		Thread.sleep(2000);	
		
	}
	public void clickOnListViewFromShopPage() throws InterruptedException {
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled( thirdCardView, driver, sa);
		Thread.sleep(2000);	
		
	}
	public void verifyCategoriesHeadingBelowClearFilterButton(String expectedText)
	{
		
		
		AllVerifications.textIsPresentOrNot(expectedText, driver,CategoriesHeadingBelowClearFilterButton, sa);
	}
	
	public int verifyNumberOfMainCategories() throws InterruptedException
{
		Thread.sleep(2000);
		 int allMainCategoryCount  = mainCategoryName.size();
		return  allMainCategoryCount;
		
		
	}
	
	
	
//	
//	public void clickOnMainCategoryFromShopPage() throws InterruptedException {
//		Thread.sleep(2000);
//		AllVerifications.clickIfVisibleAndEnabled(  mainCategories, driver, sa);
//		Thread.sleep(2000);	
//		
//	}
//
//	public void clickOnMainCategoryDropDownFromShopPage() throws InterruptedException {
//		Thread.sleep(2000);
//		AllVerifications.clickIfVisibleAndEnabled(  mainCategoriesDropDown, driver, sa);
//		Thread.sleep(2000);	
//		
//	}
	

	public void clickONClearFilterButton() throws InterruptedException {
		Thread.sleep(2000);
		AllVerifications.clickIfVisibleAndEnabled( clearFilterButton, driver, sa);
		Thread.sleep(2000);	
		
	}


//	public String verifyMainCategoryName() {
//		String actualMainCategoryText  =  mainCategories.getText();
//		return  actualMainCategoryText;
//		
//	}
	public int findTotalCategoryCount()
    {
    	int mainCategoryCount=mainCategoryName.size();
    	System.out.println("Total main categories are  "+ mainCategoryCount);
    	
    	return mainCategoryCount;
    }

    public void clickOnMainCategory(int k)
    {
//    	int mainCategoryCount=mainCategoryName.size();
//    	System.out.println("Total main categories are  "+ mainCategoryCount);
    	
    	//now find the electronics category 
    	
    WebElement	mainCategoryName=driver.findElement(By.cssSelector("div.py-10>div>div.rounded-xl>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-child("+k+")>div>span:first-child"));
    String MainCategoryName =mainCategoryName.getText();
    System.out.println("Clicking on main category "+ MainCategoryName);
    
    mainCategoryName.click();
    
    }
    //
    public void fetchAllProducts()
    {
    	int allProductsCount=allProductContainer.size();
    	System.out.println("Total products are  "+ allProductsCount);
    	
    	//now find all the products name, sp,dp
    	for(int i=1;i<=allProductsCount;i++)
    	{
    		// fetching products names
    		WebElement	eachProductName=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+i+")>div:nth-of-type(3)>h3"));
    	    System.out.println("Products names "+eachProductName.getText());
    	    
    	    //fetching products selling price
    	    WebElement	eachProductSellingPrice=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+i+")>div:nth-of-type(3)>div:nth-of-type(1)>span:first-child"));
    	    System.out.println("Selling Price "+eachProductSellingPrice.getText());
    	    
    	    //fetching products display price
    	    WebElement	eachProductDisplayPrice=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+i+")>div:nth-of-type(3)>div:nth-of-type(1)>span:last-child"));
    	    System.out.println("Display Price "+eachProductDisplayPrice.getText());
    	    
    	    
    	}    
    	}
    	
    	public void clickOnEachProduct()
        {
        	int allProductsCount=allProductContainer.size();
        	System.out.println("Total products are  "+ allProductsCount);
        	
        	//now find all the products name, sp,dp
        	for(int i=1;i<=allProductsCount;i++)
        	{
        		// fetching products names
        		WebElement	eachProductName=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+i+")>div:nth-of-type(3)>h3"));
        	    System.out.println("Clicking on Products names "+eachProductName.getText());
        	    eachProductName.click();    
        	}
        }
        	
   public void clickOnDropDownOfMainCategory(int k) throws InterruptedException {
	
	WebElement	mainCategoryName=driver.findElement(By.cssSelector("div.py-10>div>div.rounded-xl>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-child("+k+")>div>span:first-child"));
	String MainCategoryName =mainCategoryName.getText();
    WebElement	eachDropDownOfMainCategory=driver.findElement(By.cssSelector("div.py-10>div>div.rounded-xl>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-child("+k+")>div>span:last-child"));
    Thread.sleep(500);	
    System.out.println("Clicking on "+ MainCategoryName+" drop down ");
    eachDropDownOfMainCategory.click();
    Thread.sleep(500);
//    int subCategoryCount=subCategoriesOfFirstMainCategoryContainer.size();
//	System.out.println("Number of sub categories of "+ MainCategoryName + "are :"+subCategoryCount);
	
    eachDropDownOfMainCategory.click();  
//    return subCategoryCount;
  }

public int countNumberOfSubCategoriesOfThatMainCategory() {
	int subCategoryCount=subCategoriesOfFirstMainCategoryContainer.size();
	System.out.println("Number of sub categories of   are :"+subCategoryCount);
	return subCategoryCount;
}


public void fetchTheNameOfSubCatAndClick(int o) {
	WebElement	subCategoryBelongsToMainCategory=driver.findElement(By.cssSelector("div.pl-4>div.text-sm:nth-of-type("+o+")"));
  
    System.out.println("Clicking on the sub category  "+ subCategoryBelongsToMainCategory.getText());
    
    subCategoryBelongsToMainCategory.click();
	

}
//
public void verifyBrandsHeadingBelowCategoriesHeading(String expectedText)
{
	AllVerifications.textIsPresentOrNot(expectedText, driver,brandsHeadingBelowCategoriesHeading, sa);
}


public void verifyAllBrandsSubHeadingBelowBrandsHeading(String expectedText) 
{
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement(allBrandsLinkBelowBrandsHeading).build().perform();
	AllVerifications.textIsPresentOrNot(expectedText, driver,allBrandsLinkBelowBrandsHeading, sa);
	
}


public void clickOnAllBrandsSubHeadingBelowBrandsHeading() throws InterruptedException
{
	 Thread.sleep(2000);
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	js.executeScript("window.scrollTo(0, 500);");
      AllVerifications.clickIfVisibleAndEnabled(allBrandsLinkBelowBrandsHeading, driver, sa);
      Thread.sleep(2000);
	
}


public void clickOnDropDownOfAllBrandsSubHeadingBelowBrandsHeading() throws InterruptedException {
	Thread.sleep(2000);
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	js.executeScript("window.scrollTo(0, 500);");
	AllVerifications.clickIfVisibleAndEnabled(dropDownOfAllBrandsBelowToBrandsHeading, driver, sa);
	Thread.sleep(2000);
	
}


public void clickOnCheckBoxOfAnyBrands() throws InterruptedException 
{
	Thread.sleep(2000);
	int allCheckBoxesCount=checkBoxesOfBrands_Container.size();
	for(int i=1;i<=allCheckBoxesCount;i++) 
	{
		WebElement	CheckBoxOfBrands=driver.findElement(By.cssSelector("div.space-y-6>div:nth-of-type(3)>div:last-child>div:last-child>div.flex:nth-of-type("+i+")>input"));
		WebElement  brandNamesBelongToThatCheckBox = driver.findElement(By.cssSelector("div.space-y-6>div:nth-of-type(3)>div:last-child>div:last-child>div.flex:nth-of-type("+i+")>span"));
	    System.out.println("Clicking on the checkboxes of brand "+  brandNamesBelongToThatCheckBox.getText());
	    
		CheckBoxOfBrands.click();
		
		
	}
	Thread.sleep(1000);
}

public void clickOnBrandNamesOfAllBrandsSection() throws InterruptedException 
{

	Thread.sleep(1000);
	int allBrandsCount=checkBoxesOfBrands_Container.size();
	for(int i=1;i<=allBrandsCount;i++) 
	{
		JavascriptExecutor js =(JavascriptExecutor)driver; 
		
		WebElement	brandNamesOfAllBrandsSection=driver.findElement(By.cssSelector("div.space-y-6>div:nth-of-type(3)>div:last-child>div:last-child>div.flex:nth-of-type("+i+")>span"));
		Actions actions=new Actions(driver);
		actions.scrollToElement(brandNamesOfAllBrandsSection).build().perform();
		
	    System.out.println("Clicking on the  brand name "+ brandNamesOfAllBrandsSection.getText());
	    brandNamesOfAllBrandsSection.click();
	
	}
	
	Thread.sleep(1000);
}


public void clickOnBrandNamesOfAllBrandsSectionAndFetchAllTheProductsBelongsToThatBrand() throws InterruptedException 
{
	Thread.sleep(1000);
	int allBrandsCount=checkBoxesOfBrands_Container.size();
	for(int i=1;i<=allBrandsCount;i++) 
	{
		JavascriptExecutor js =(JavascriptExecutor)driver; 
		
		WebElement	brandNamesOfAllBrandsSection=driver.findElement(By.cssSelector("div.space-y-6>div:nth-of-type(3)>div:last-child>div:last-child>div.flex:nth-of-type("+i+")>span"));
		Actions actions=new Actions(driver);
		actions.scrollToElement(brandNamesOfAllBrandsSection).build().perform();
		
	    System.out.println("Clicking on the  brand "+ brandNamesOfAllBrandsSection.getText());
	    
	    brandNamesOfAllBrandsSection.click();
		
	    int allProductsCount=allProductContainer.size();
	    System.out.println("Total products are  "+ allProductsCount);
	    
	    	//now find all the products name, sp,dp
	    	for(int j=1;j<=allProductsCount;j++)
	    	{
	    		// fetching products names
	    		WebElement	eachProductName=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+j+")>div:nth-of-type(3)>h3"));
	    	    System.out.println("Products belonging to "+brandNamesOfAllBrandsSection.getText()+" brands are :"+eachProductName.getText());
	    	    
	    	    //fetching products selling price
	    	    WebElement	eachProductSellingPrice=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+j+")>div:nth-of-type(3)>div:nth-of-type(1)>span:first-child"));
	    	    System.out.println("Selling Price "+eachProductSellingPrice.getText());
	    	    
	    	    //fetching products display price
	    	    WebElement	eachProductDisplayPrice=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+j+")>div:nth-of-type(3)>div:nth-of-type(1)>span:last-child"));
	    	    System.out.println("Display Price "+eachProductDisplayPrice.getText());
	    	    Thread.sleep(1000);
	    	    
	    	} 
//	    	JavascriptExecutor js1 =(JavascriptExecutor)driver; 
//	    	Actions action=new Actions(driver);
	    	actions.scrollToElement(clearFilterButton).build().perform();
	    	clearFilterButton.click();	
	    	Thread.sleep(1000);
	}
	//
	Thread.sleep(1000);
}

public void clickOnCheckBoxOfAnyBrandBelongsToAllBrandsSectionAndFetchAllTheProductsBelongsToThatBrand() throws InterruptedException 
{
	int allCheckBoxesCount=checkBoxesOfBrands_Container.size();
	for(int i=1;i<=allCheckBoxesCount;i++) 
	{
		JavascriptExecutor js =(JavascriptExecutor)driver; 
		WebElement	CheckBoxOfBrands=driver.findElement(By.cssSelector("div.space-y-6>div:nth-of-type(3)>div:last-child>div:last-child>div.flex:nth-of-type("+i+")>input"));
		Actions actions=new Actions(driver);
		actions.scrollToElement(CheckBoxOfBrands).build().perform();
		
		WebElement  brandNamesBelongToThatCheckBox = driver.findElement(By.cssSelector("div.space-y-6>div:nth-of-type(3)>div:last-child>div:last-child>div.flex:nth-of-type("+i+")>span"));
	    System.out.println("Clicking on the checkboxes of brand "+  brandNamesBelongToThatCheckBox.getText());
	    
	    CheckBoxOfBrands.click();
		
	    int allProductsCount=allProductContainer.size();
	    System.out.println("Total products are  "+ allProductsCount);
	    
	    	//now find all the products name, sp,dp
	    	for(int j=1;j<=allProductsCount;j++)
	    	{
	    		// fetching products names
	    		WebElement	eachProductName=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+j+")>div:nth-of-type(3)>h3"));
	    	    System.out.println("Products belonging to "+ brandNamesBelongToThatCheckBox.getText()+" brands are :"+eachProductName.getText());
	    	    
	    	    //fetching products selling price
	    	    WebElement	eachProductSellingPrice=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+j+")>div:nth-of-type(3)>div:nth-of-type(1)>span:first-child"));
	    	    System.out.println("Selling Price "+eachProductSellingPrice.getText());
	    	    
	    	    //fetching products display price
	    	    WebElement	eachProductDisplayPrice=driver.findElement(By.cssSelector("div.grid:last-child>div.relative:nth-of-type("+j+")>div:nth-of-type(3)>div:nth-of-type(1)>span:last-child"));
	    	    System.out.println("Display Price "+eachProductDisplayPrice.getText());
	    	    Thread.sleep(1000);
	    	    
	    	} 
//	    	JavascriptExecutor js1 =(JavascriptExecutor)driver; 
//	    	Actions action=new Actions(driver);
	    	actions.scrollToElement(clearFilterButton).build().perform();
	    	clearFilterButton.click();	
	    	Thread.sleep(1000);
	}
	//
	Thread.sleep(1000);
}
	
	



public void verifyPriceRangeHeadingBelowAllBrandsHeading(String expectedText) {
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement(priceRangeHeadingBelowAllBrands).build().perform();
	AllVerifications.textIsPresentOrNot(expectedText, driver, priceRangeHeadingBelowAllBrands, sa);
	
}


public void verifySortByHeadingBelowPriceRange(String expectedText) {
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement(sortByHeadingBelowPriceRange).build().perform();
	AllVerifications.textIsPresentOrNot(expectedText, driver, sortByHeadingBelowPriceRange, sa);
	
}


public void clickOnDefaultButtonBelowSortByHeading() {
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement(defaultButtonBelongsToSortByHeading).build().perform();
	AllVerifications.clickIfVisibleAndEnabled(defaultButtonBelongsToSortByHeading, driver, sa);
	
}


public void clickOnPriceIncreaseButtonBelowSortByHeading() throws InterruptedException 
{
	Thread.sleep(1000);
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement(priceIncreaseBelongsToSortByHeading).build().perform();
	AllVerifications.clickIfVisibleAndEnabled(priceIncreaseBelongsToSortByHeading, driver, sa);
	Thread.sleep(1000);
	
}


public void clickOnPriceDecreaseButtonBelowSortByHeading() throws InterruptedException {
	Thread.sleep(1000);
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement(priceDecreaseBelongsToSortByHeading).build().perform();
	AllVerifications.clickIfVisibleAndEnabled(priceDecreaseBelongsToSortByHeading, driver, sa);
	Thread.sleep(1000);
	
	
}


public void clickOnOldestButtonBelowSortByHeading() throws InterruptedException {
	Thread.sleep(1000);
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement( oldestButtonBelongsToSortByHeading).build().perform();
	AllVerifications.clickIfVisibleAndEnabled( oldestButtonBelongsToSortByHeading, driver, sa);
	Thread.sleep(1000);
	
}


public void clickOnNewestButtonBelowSortByHeading() throws InterruptedException {
	Thread.sleep(1000);
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement( newestButtonBelongsToSortByHeading).build().perform();
	AllVerifications.clickIfVisibleAndEnabled( newestButtonBelongsToSortByHeading, driver, sa);
	Thread.sleep(1000);
	
}


public void clickOnFirstPaginationButton() throws InterruptedException 
{
	Thread.sleep(1000);
	JavascriptExecutor js =(JavascriptExecutor)driver;
	Actions actions=new Actions(driver);
	actions.scrollToElement( firstPaginationButton).build().perform();
	AllVerifications.clickIfVisibleAndEnabled(firstPaginationButton, driver, sa);
	Thread.sleep(1000);
    
}


public void clickOnSecondPaginationButton() throws InterruptedException 
{
	Thread.sleep(1000);
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement( secondPaginationButton).build().perform();
	AllVerifications.clickIfVisibleAndEnabled(secondPaginationButton, driver, sa);
	Thread.sleep(1000);
}
//

public void clickOnThirdPaginationButton() throws InterruptedException 
{
	Thread.sleep(2000);
	JavascriptExecutor js =(JavascriptExecutor)driver; 
	Actions actions=new Actions(driver);
	actions.scrollToElement( thirdPaginationButton).build().perform();
	AllVerifications.clickIfVisibleAndEnabled(thirdPaginationButton, driver, sa);
	Thread.sleep(2000);
	
}









}
//checkBoxesOfBrands_Container
//


    
   


	

	
	//
	 
	

