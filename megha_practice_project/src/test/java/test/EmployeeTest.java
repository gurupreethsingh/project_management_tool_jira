package test;

import static org.testng.Assert.assertEquals;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.github.javafaker.Faker;

import entity.Employee;
import functions.EmployeeFunction;
import io.restassured.response.Response;

public class EmployeeTest 
{
  Faker faker;
  
  Employee employee;
  
  @BeforeClass
  
  public void setUpdata() 
  {
  faker =new Faker();
    employee =new Employee();
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
@Test
public void testEmployeecreation() 
{
	Response response =EmployeeFunction.createEmployee(employee);
{
		response.then().log().all();
		Assert.assertEquals(response.getStatusCode(), 201);	
}
} @Test
 public void testGetAllemployee()
{
    	Response response =EmployeeFunction.getAllemployee();
{
    		response.then().log().all();
    		Assert.assertEquals(response.getStatusCode(), 200);
}
}@Test
 public void testGetemployeeById()
 {
	String hardcodedEmployeeId = "670665d4562c3c0f235f3a52"; // Replace with a valid employee ID from your database
	Response response =EmployeeFunction.getEmployeeByid(hardcodedEmployeeId);
	{
	response.then().log().all();
	Assert.assertEquals(response.getStatusCode(), 200);
	
	}			
 }
String hardcodedEmployeeId1 = "670665d4562c3c0f235f3a52";
@Test
public void testUpdateEmployeeById()
{
Response response =EmployeeFunction.updateEmployeebyid(hardcodedEmployeeId1, employee);
{
	response.then().log().all();
	Assert.assertEquals(response.getStatusCode(), 200);
}
}
String HARDCODED_EMPLOYEE_ID1 = "670665d4562c3c0f235f3a52";
@Test
public void testDeleteEmployeeById() {
System.out.println("deleteing employee id: " + HARDCODED_EMPLOYEE_ID1 );

Response response =EmployeeFunction.deleteEmployee( HARDCODED_EMPLOYEE_ID1 );
{
	response.then().log().all();
	Assert.assertEquals(response.getStatusCode(), 200);
	}
}


}
