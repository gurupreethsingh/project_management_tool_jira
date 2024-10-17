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
}
}
