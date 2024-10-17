package functions;

import entity.Employee;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import urls.EmployeeUrl;
import static io.restassured.RestAssured.given;

public class EmployeeFunction
{
public static Response createEmployee(Employee employee)
{
	Response response=given()
			.contentType(ContentType.JSON)
			.accept(ContentType.JSON)
			.body(employee)
			.when()
			.post(EmployeeUrl.post_createemployee_url);
	return response;
}

public static Response getAllemployee()
{
	Response response=given()
			.when()
			.get(EmployeeUrl.get_allemployee_url);
	return response;
	
}

public static Response getEmployeeByid(String id)
{
	Response response=given()
			.pathParam("id", id)
			.when()
			.get(EmployeeUrl.get_employee_by_id_url);
	return response;
}

public static Response updateEmployeebyid(String id ,Employee employee)
{
	Response response=given()
			.contentType(ContentType.JSON)
			.accept(ContentType.JSON)
			.body(employee)
			.pathParam("id", id)
			.when()
			.put(EmployeeUrl.put_updateemployee_by_id_url);
	return response;
}

public static Response deleteEmployee(String id)
{
    Response response=given()
            .pathParam("id", id)
            .when()
            .delete(EmployeeUrl.delete_deleteemployee_by_id_url);
   return response;

}
}



