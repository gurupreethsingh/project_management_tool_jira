package urls;

public class EmployeeUrl
{
	
 public static String base_url="http://localhost:3001";

 public static String post_createemployee_url=base_url+"/register";
 
 public static String post_login_url=base_url+"/login";
 //Employee Module
 public static String get_allemployee_url=base_url+"/api/employees";
 
 public static String get_employee_by_id_url=base_url+"/employee/:id";

 public static String put_updateemployee_by_id_url=base_url+"/updateemployee/:id";
 
 public static String delete_deleteemployee_by_id_url=base_url+"/deleteemployee/:id";
 
 
 


}
