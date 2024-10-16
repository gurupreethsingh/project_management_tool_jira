package routes;

public class Employee_routes 
{
	public static String base_url="http://localhost:3001";
	
    // Employee module
	//routes to register

    public static String post_createemployee_url=base_url+"/register";

    // route to login
   public static String post_login_url=base_url+"/login";

   // route to fetch all the employees.
  public static String get_allemployee_url=base_url+"/api/employees";

  // route to fetch one employee using id. 
  public static String get_employee_by_id_url=base_url+"/employee/{id}";

   // route to delete the employee using id.
   public static String delete_employee_url=base_url+"/deleteemployee/{id}";

   // route to update the employee using id.
   public static String update_employee_url=base_url+"/updateemployee/{id}";

}
