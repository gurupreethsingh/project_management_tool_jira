//// file: src/main/java/generic/BaseClass_Shilpa.java
//package generic;
//
//import java.io.File;
//import java.io.FileInputStream;
//import java.time.Duration;
//import org.apache.poi.ss.usermodel.*;
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.chrome.ChromeDriver;
//import org.testng.annotations.*;
//
//interface AutomationConstants_Shilpa {
//    String rootDirectory = System.getProperty("user.dir");
//    String excelSheetPath = rootDirectory + File.separator + "project_documents_shilpa_contactUs.xlsx";
//    String failedScreenshots = rootDirectory + File.separator + "failedScreenshots";
//    String URL_OF_APPLICATION = "http://localhost:5173";
//    String PATH_CONTACT_US = "/contact-us";
//    String URL_CONTACT_US = URL_OF_APPLICATION + PATH_CONTACT_US;
//}
//
//class OpenClose_Contact_shilpa implements AutomationConstants_Shilpa {
//    public static WebDriver driver = null;
//
//    @BeforeMethod
//    public static void openApplication() {
//        driver = new ChromeDriver();
//        driver.manage().window().maximize();
//        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
//        driver.get(URL_CONTACT_US);
//        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
//    }
//
//    @AfterMethod
//    public static void closeApplication() {
//        driver.quit();
//    }
//}
//
//public class BaseClass_Shilpa extends OpenClose_Contact_shilpa implements AutomationConstants_Shilpa {
//
//    /** NOW it’s nested and importable as generic.BaseClass_Shilpa.Excel_Shilpa */
//	public static class Excel_Shilpa implements AutomationConstants_Shilpa {
//	    public static Object getData(String sheetName, int rowNumber, int cellNumber) {
//	        Object value = null;
//	        try (FileInputStream fis = new FileInputStream(new File(excelSheetPath))) {
//	            Workbook wb = WorkbookFactory.create(fis);
//	            Sheet sh = wb.getSheet(sheetName);
//	            if (sh == null) throw new IllegalArgumentException("Sheet not found: " + sheetName);
//
//	            Row row = sh.getRow(rowNumber);
//	            if (row == null) return ""; // treat missing row as blank
//
//	            // CREATE_NULL_AS_BLANK avoids NPE and normalizes “missing” to BLANK
//	            Cell cell = row.getCell(cellNumber, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
//
//	            switch (cell.getCellType()) {
//	                case STRING: {
//	                    String s = cell.getStringCellValue();
//	                    value = (s == null) ? "" : s.trim(); // handle spaces-only -> ""
//	                    break;
//	                }
//	                case NUMERIC: {
//	                    if (DateUtil.isCellDateFormatted(cell)) {
//	                        value = cell.getDateCellValue().toString();
//	                    } else {
//	                        value = cell.getNumericCellValue(); // still Double
//	                    }
//	                    break;
//	                }
//	                case BOOLEAN: {
//	                    value = cell.getBooleanCellValue();
//	                    break;
//	                }
//	                case BLANK: {
//	                    value = "";
//	                    break;
//	                }
//	                case ERROR: {
//	                    value = "ERROR: " + cell.getErrorCellValue();
//	                    break;
//	                }
//	                case FORMULA: {
//	                    switch (cell.getCachedFormulaResultType()) {
//	                        case STRING: {
//	                            String s = cell.getStringCellValue();
//	                            value = (s == null) ? "" : s.trim(); // trim/empty handling
//	                            break;
//	                        }
//	                        case NUMERIC: {
//	                            if (DateUtil.isCellDateFormatted(cell)) {
//	                                value = cell.getDateCellValue().toString();
//	                            } else {
//	                                value = String.valueOf(cell.getNumericCellValue());
//	                            }
//	                            break;
//	                        }
//	                        case BOOLEAN: {
//	                            value = String.valueOf(cell.getBooleanCellValue());
//	                            break;
//	                        }
//	                        case BLANK: {
//	                            value = "";
//	                            break;
//	                        }
//	                        default: {
//	                            value = "Unsupported formula result type";
//	                        }
//	                    }
//	                    break;
//	                }
//	                default: {
//	                    // Fallback: treat as text and trim
//	                    DataFormatter fmt = new DataFormatter();
//	                    String s = fmt.formatCellValue(cell);
//	                    value = (s == null) ? "" : s.trim();
//	                }
//	            }
//	        } catch (Exception ex) {
//	            throw new RuntimeException(
//	                "Excel read failed: " + excelSheetPath +
//	                " [sheet=" + sheetName + ", row=" + rowNumber + ", col=" + cellNumber + "]", ex);
//	        }
//	        return value;
//	    }
//	}
//
//}
package generic;

import java.io.File;
import java.io.FileInputStream;
import java.time.Duration;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

interface AutomationConstants_Shilpa {
    String rootDirectory   = System.getProperty("user.dir");
    String excelSheetPath  = rootDirectory + File.separator + "project_documents_shilpa_contactUs.xlsx";
    String failedScreenshots = rootDirectory + File.separator + "failedScreenshots";

    String URL_OF_APPLICATION = "http://localhost:5173";
    String PATH_CONTACT_US    = "/contact-us";
    String URL_CONTACT_US     = URL_OF_APPLICATION + PATH_CONTACT_US;
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
        if (driver != null) {
            driver.quit();
        }
    }
}

public class BaseClass_Shilpa extends OpenClose_Contact_shilpa implements AutomationConstants_Shilpa {

    /** Nested & importable as generic.BaseClass_Shilpa.Excel_Shilpa */
    public static class Excel_Shilpa implements AutomationConstants_Shilpa {

        /**
         * Keeps your exact signature/shape.
         * - Missing row/cell => returns "" (empty string)
         * - STRING / FORMULA-STRING => trimmed, spaces-only => ""
         * - NUMERIC => returns Double (do NOT cast to String directly)
         * - DATE => returns String (cell.getDateCellValue().toString())
         * - BOOLEAN => returns boolean
         */
        public static Object getData(String sheetName, int rowNumber, int cellNumber) {
            Object value = null;
            try (FileInputStream fis = new FileInputStream(new File(excelSheetPath))) {
                Workbook wb = WorkbookFactory.create(fis);
                Sheet sh = wb.getSheet(sheetName);
                if (sh == null) throw new IllegalArgumentException("Sheet not found: " + sheetName);

                Row row = sh.getRow(rowNumber);
                if (row == null) return "";  // treat missing row as blank

                // Create null as blank to normalize missing cells
                Cell cell = row.getCell(cellNumber, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);

                CellType ct = cell.getCellType();
                switch (ct) {
                    case STRING: {
                        String s = cell.getStringCellValue();
                        value = (s == null) ? "" : s.trim();
                        break;
                    }

                    case NUMERIC: {
                        if (DateUtil.isCellDateFormatted(cell)) {
                            value = cell.getDateCellValue().toString();
                        } else {
                            value = cell.getNumericCellValue(); // Double
                        }
                        break;
                    }

                    case BOOLEAN: {
                        value = cell.getBooleanCellValue();
                        break;
                    }

                    case BLANK: {
                        value = "";
                        break;
                    }

                    case ERROR: {
                        value = "ERROR: " + cell.getErrorCellValue();
                        break;
                    }

                    case FORMULA: {
                        switch (cell.getCachedFormulaResultType()) {
                            case STRING: {
                                String s = cell.getStringCellValue();
                                value = (s == null) ? "" : s.trim();
                                break;
                            }
                            case NUMERIC: {
                                if (DateUtil.isCellDateFormatted(cell)) {
                                    value = cell.getDateCellValue().toString();
                                } else {
                                    value = String.valueOf(cell.getNumericCellValue());
                                }
                                break;
                            }
                            case BOOLEAN: {
                                value = String.valueOf(cell.getBooleanCellValue());
                                break;
                            }
                            case BLANK: {
                                value = "";
                                break;
                            }
                            default: {
                                value = "Unsupported formula result type";
                            }
                        }
                        break;
                    }

                    default: {
                        // Fallback: treat other types as text-like & trim
                        String s = cell.toString();
                        value = (s == null) ? "" : s.trim();
                    }
                }
            } catch (Exception ex) {
                throw new RuntimeException(
                    "Excel read failed: " + excelSheetPath +
                    " [sheet=" + sheetName + ", row=" + rowNumber + ", col=" + cellNumber + "]", ex
                );
            }
            return value;
        }
    }
}

