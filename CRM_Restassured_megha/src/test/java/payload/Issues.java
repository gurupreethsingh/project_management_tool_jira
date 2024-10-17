package payload;

public class Issues 
{
	private String title;
    private String description;
    private String status; // Assuming you might want to include status
    private String createdAt; // Similarly, if you want to include these
    private String updatedAt;
    private String customer_id;
    private String assigned_employee_id;
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}
	public String getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(String updatedAt) {
		this.updatedAt = updatedAt;
	}
	public String getCustomer_id() {
		return customer_id;
	}
	public void setCustomer_id(String customer_id) {
		this.customer_id = customer_id;
	}
	public String getAssigned_employee_id() {
		return assigned_employee_id;
	}
	public void setAssigned_employee_id(String assigned_employee_id) {
		this.assigned_employee_id = assigned_employee_id;
	}
    
}
