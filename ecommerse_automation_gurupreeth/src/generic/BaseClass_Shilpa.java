// file: src/main/java/generic/BaseClass_Shilpa.java
package generic;

import java.io.File;
import java.io.FileInputStream;
import java.time.Duration;
import org.apache.poi.ss.usermodel.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.*;

interface AutomationConstants_Shilpa {
    String rootDirectory = System.getProperty("user.dir");
    String excelSheetPath = rootDirectory + File.separator + "project_documents_shilpa_contactUs.xlsx";
    String failedScreenshots = rootDirectory + File.separator + "failedScreenshots";
    String URL_OF_APPLICATION = "http://localhost:5173";
    String PATH_CONTACT_US = "/contact-us";
    String URL_CONTACT_US = URL_OF_APPLICATION + PATH_CONTACT_US;
}

class OpenClose_Contact_shilpa implements AutomationConstants_Shilpa {
    public static WebDriver driver = null;

    @BeforeMethod
    public static void openApplication() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
        driver.get(URL_CONTACT_US);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
    }

    @AfterMethod
    public static void closeApplication() {
        driver.quit();
    }
}

public class BaseClass_Shilpa extends OpenClose_Contact_shilpa implements AutomationConstants_Shilpa {

    /** NOW it’s nested and importable as generic.BaseClass_Shilpa.Excel_Shilpa */
    public static class Excel_Shilpa implements AutomationConstants_Shilpa {
        public static Object getData(String sheetName, int rowNumber, int cellNumber) {
            Object value = null;
            try (FileInputStream fis = new FileInputStream(new File(excelSheetPath))) {
                Workbook wb = WorkbookFactory.create(fis);
                Sheet sh = wb.getSheet(sheetName);
                if (sh == null) throw new IllegalArgumentException("Sheet not found: " + sheetName);

                Row row = sh.getRow(rowNumber);
                if (row == null) throw new IllegalArgumentException("Row null: " + rowNumber);

                Cell cell = row.getCell(cellNumber);
                if (cell == null) throw new IllegalArgumentException("Cell null: (" + rowNumber + "," + cellNumber + ")");

                switch (cell.getCellType()) {
                    case STRING:  return cell.getStringCellValue();
                    case NUMERIC:
                        if (DateUtil.isCellDateFormatted(cell)) return cell.getDateCellValue().toString();
                        return cell.getNumericCellValue();
                    case BOOLEAN: return cell.getBooleanCellValue();
                    case BLANK:   return "";
                    case ERROR:   return "ERROR: " + cell.getErrorCellValue();
                    case FORMULA:
                        switch (cell.getCachedFormulaResultType()) {
                            case STRING:  return cell.getStringCellValue();
                            case NUMERIC: return String.valueOf(cell.getNumericCellValue());
                            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
                            default:      return "Unsupported formula result type";
                        }
                    default:       return "Unknown Cell Type";
                }
            } catch (Exception ex) {
                throw new RuntimeException("Excel read failed: " + excelSheetPath +
                        " [sheet=" + sheetName + ", row=" + rowNumber + ", col=" + cellNumber + "]", ex);
            }
        }
    }
}
