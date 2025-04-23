package PantryPal.PantryPal.dto;

import PantryPal.PantryPal.model.Category;

public class PantryItemDTO {
    private Long id;
    private Long userId;
    private String name;
    private Category category;
    private Double quantity;
    private String unit;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id;}

    public Long getUserId() { return userId;}
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity;}

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}
