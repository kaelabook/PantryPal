package PantryPal.PantryPal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "shopping_cart")
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double quantity;
    private String unit;

    @Enumerated(EnumType.STRING)
    private Category category;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity;}

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
