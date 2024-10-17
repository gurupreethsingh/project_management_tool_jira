package mysql_database;

import java.sql.*;

public class O2_Showing_All_Databases {

	public static void main(String[] args) {
		Connection conn = null;
		try {
			// try to connect mysql
			Class.forName("com.mysql.cj.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://localhost:3306", "root", "root");
			if (conn == null) {

				System.out.println("connection failed");
			} else {
				System.out.println("connected successfully to mysql database");
				PreparedStatement ps = conn.prepareStatement("show databases");
				ResultSet rs = ps.executeQuery();
				while (rs.next()) {
					System.out.println(rs.getString(1));
				}

			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
}
