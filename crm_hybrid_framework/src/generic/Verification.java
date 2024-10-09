package generic;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.util.Date;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Reporter;
import com.google.common.io.Files;

public class Verification {

    private WebDriver driver;

    protected Verification(WebDriver driver) {
        this.driver = driver;
    }

    public void verifyTitle(String expectedTitle) throws IOException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        try {
            wait.until(ExpectedConditions.titleIs(expectedTitle));
        } catch (Exception ex) {
            ex.printStackTrace();
            Reporter.log("Test case failed, Title did not match");
            takeScreenshot();
        }
    }

    public void verifyUrl(String expectedUrl) throws IOException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        try {
            wait.until(ExpectedConditions.urlMatches(expectedUrl));
        } catch (Exception ex) {
            ex.printStackTrace();
            Reporter.log("Test case failed, URL did not match");
            takeScreenshot();
        }
    }

    private void takeScreenshot() throws IOException {
        TakesScreenshot ts = (TakesScreenshot) driver;
        File source = ts.getScreenshotAs(OutputType.FILE);
        String screenshotFolder = System.getProperty("user.dir") + "\\failed_Screenshots";
        Date d = new Date();
        File destination = new File(screenshotFolder + "\\image_" + d + ".jpg");
        Files.copy(source, destination);
    }
}
