package scripts.contactus_scripts.functional_scenarios;

import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import generic.AllVerifications;
import generic.Excel;
import generic.OpenClose;
import generic.OpenClose_Contactus;

public class ET_6652_OpenContactUsUsingUrl  extends OpenClose_Contactus
{
	SoftAssert sa = new SoftAssert();
	
	@Test(enabled = true, priority = 1)
   public void openContactpageUsingUrl()
   {
		String expectedContactpageTitle = (String)Excel.getData("ContactUspage",1,0);
		AllVerifications.verifyTitle(expectedContactpageTitle, driver, sa);
		sa.assertAll();
   }
	
}
   
