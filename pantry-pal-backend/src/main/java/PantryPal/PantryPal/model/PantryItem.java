package PantryPal.PantryPal.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;

@Entity
@Table(name = "pantry_items")
public class PantryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255)")
    private Category category;

    @JsonValue
    public String getCategoryValue() {
        return category.name().toLowerCase();
    }

    @JsonCreator
    public static Category forValue(String value) {
        return Category.valueOf(value.toUpperCase());
    }

    private Double quantity;
    private String unit;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name;}

    public Category getCategory() { return category;}
    public void setCategory(Category category) { this.category = category; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}

enum IngredientCategory {
    FRUITS, VEGETABLES, GRAINS, PROTEIN, DAIRY, SEASONINGS, SUBSTITUTIONS, MISC
}
