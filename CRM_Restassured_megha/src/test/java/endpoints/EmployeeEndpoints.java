
package endpoints;

import io.restassured.http.ContentType;
import io.restassured.response.Response;
import payload.Employee;
import routes.Employee_routes;
import static io.restassured.RestAssured.given;


public class EmployeeEndpoints
{
public static Response createEmployee(Employee employee) 
{
	Response response=given()
			.contentType(ContentType.JSON)
			.accept(ContentType.JSON)
			.body(employee)
			.when()
			
	        .post(Employee_routes.post_createemployee_url);
	return response;
	}
public static Response getAllemployee()
{
	Response response=given()
			.when()
	        .get(Employee_routes.get_allemployee_url);
	return response;
}
public static Response getEmployeeById(String id)
{
	Response response=given()
			.pathParam("id", id)
			.when()
	        .get(Employee_routes.get_employee_by_id_url);
	return response;
}
public static Response updatedEmployeeById(String id,Employee employee)
{
	Response response=given()
			.contentType(ContentType.JSON)
			.accept(ContentType.JSON)
			.body(employee)
			.pathParam("id", id)
			.when()
	        .put(Employee_routes.update_employee_url);
	return response;
}
public static Response deleteEmployeeById(String hARDCODED_EMPLOYEE_ID)
{
	Response response = given()
			.pathParam("id", hARDCODED_EMPLOYEE_ID)
			.when()
			.delete(Employee_routes.delete_employee_url);
   return response;
}

}
