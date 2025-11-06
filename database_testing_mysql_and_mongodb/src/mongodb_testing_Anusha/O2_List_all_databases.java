package mongodb_testing_Anusha;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoIterable;

public class O2_List_all_databases 
{
	public static void main (String[] args)
	{
		 com.mongodb.client.MongoClient connection = null;
	        try {
	            connection = MongoClients.create("mongodb://localhost:27017");        // connect

	            if (connection != null) {
	                System.out.println("Connected to MongoDB and it is reachable.");
	                MongoIterable<String> allDatabaseNames = connection.listDatabaseNames();

	                boolean databaseFetched = false;
	                int count = 0; 
	                for (String name : allDatabaseNames) 
	                {
	                    System.out.println(" - " + name);
	                    databaseFetched = true;
	                    count++;
	                }

	                if (!databaseFetched) {
	                    System.out.println("(no databases found)");
	                }
	                else
	                {
	                	System.out.println("Tatal Databases : " + count);
	                }
	            } else {
	                System.out.println("Connected, but no databases found.");
	            }
	        } 
	        catch (Exception ex) 
	        {
	            ex.printStackTrace();
	        } 
	        finally 
	        {
	            if (connection != null)
	            	{
	            	connection.close();
	            	}
	        }
	    }
	}


