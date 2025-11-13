package scripts.productScripts;

import java.util.Arrays;

import org.testng.Assert;
import org.testng.annotations.Test;
import endpoints.ProductsEndpoints;
import entity.Product;
import io.restassured.response.Response;

public class AddingNewProduct {

    @Test
    public void testAddingNewProduct() {
        // Create new product object
        Product p = new Product();
        p.setProduct_name("Mysore Silk Saree Premium Edition");
        p.setSlug("mysore-silk-saree-premium");
        p.setDescription("A premium-quality Mysore Silk Saree made from authentic silk threads.");
        p.setSku("MS-SILK-001");
        p.setSelling_price(4500.00);
        p.setDisplay_price(5999.00);
        p.setBrand("Mysore Silks");
        p.setBarcode("8901234567890");
        p.setStock(50);
        p.setColor("Maroon");
        p.setMaterial("Silk");

        p.setTags(Arrays.asList("saree", "silk", "premium", "traditional", "women-wear"));
        p.setCategory("684956d83a4b617708e78d48");
        p.setSubcategory("6811dd8da5cbb3bc5bc3b9d6");
        p.setVendor("6811d979a5cbb3bc5bc3b74b");
        p.setOutlet("6811d997a5cbb3bc5bc3b761");
        // Call API
        Response res = ProductsEndpoints.addProduct(p);

        // Log the full response
        res.then().log().all();

        // Validate status code
        Assert.assertEquals(res.getStatusCode(), 201, "❌ Product creation failed. API route not working.");

        System.out.println("✅ Product created successfully!");
    }
}
