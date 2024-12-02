
package scripts;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.github.javafaker.Faker;

import endpoints.EmployeeEndpoints;
import io.restassured.response.Response;
import payload.Employee;

public class EmployeeTest {
	Faker faker;
	Employee employee;

	@BeforeClass
	public void setupData() {
		faker = new Faker();
		employee = new Employee();
		employee.setFirst_name(faker.name().firstName());
		employee.setLast_name(faker.name().lastName());
		employee.setEmail(faker.internet().safeEmailAddress());
		employee.setPassword(faker.internet().password());
		employee.setPhone(faker.phoneNumber().cellPhone());
		employee.setDepartment(faker.company().industry());
		employee.setPosition(faker.job().title());
		employee.setEmployee_image(faker.internet().avatar());
		employee.setCreated_at(faker.date().past(365, java.util.concurrent.TimeUnit.DAYS).toString());
		employee.setUpdated_at(faker.date().past(30, java.util.concurrent.TimeUnit.DAYS).toString());

	}

	@Test(priority = 1)
	public void testEmployeecreation() {
		Response response = EmployeeEndpoints.createEmployee(employee);

		response.then().log().all();

		Assert.assertEquals(response.getStatusCode(), 201);
	}

	@Test(priority = 2)
	public void testGetAllemployees() {
		Response response = EmployeeEndpoints.getAllemployee();
		response.then().log().all();

		Assert.assertEquals(response.getStatusCode(), 200);

	}
	
	@Test(priority = 3)
    public void testGetEmployeeById() {
        // Hardcoded Employee ID for testing
        String hardcodedEmployeeId = "670665d4562c3c0f235f3a52"; // Replace with a valid employee ID from your database
        Response response = EmployeeEndpoints.getEmployeeById(hardcodedEmployeeId);
		response.then().log().all();

		Assert.assertEquals(response.getStatusCode(), 200);

	}
	String HARDCODED_EMPLOYEE_ID = "670665d4562c3c0f235f3a52";
	
	@Test(priority = 4)
		 public void testDeleteEmployeeById() {
	    System.out.println("Deleting Employee ID: " + HARDCODED_EMPLOYEE_ID); // Print the ID for debugging
	    Response response = EmployeeEndpoints.deleteEmployeeById(HARDCODED_EMPLOYEE_ID);
		response.then().log().all();

		Assert.assertEquals(response.getStatusCode(), 200);

		
	}
	
	String HARDCODED_EMPLOYEE_ID1= "670665d4562c3c0f235f3a52";
	@Test(priority = 5)
	public void testUpdateEmployeeById() {
		Response response = EmployeeEndpoints.updatedEmployeeById(HARDCODED_EMPLOYEE_ID1, employee);
		response.then().log().all();

		Assert.assertEquals(response.getStatusCode(), 200);

	}
}
