package PantryPal.PantryPal.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Category {
    FRUITS("Fruits"),
    VEGETABLES("Vegetables"),
    GRAINS("Grains"),
    PROTEIN("Protein"),
    DAIRY("Dairy"),
    SEASONINGS("Seasonings"),
    SUBSTITUTIONS("Substitutions"),
    MISC("Miscellaneous");

    private final String value;

    Category(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Category fromValue(String value) {
    if (value == null) return null;
    
    // Trim and convert to uppercase
    value = value.trim().toUpperCase();
    
    try {
        return Category.valueOf(value);
    } catch (IllegalArgumentException e) {
        // Fallback to case-insensitive match
        for (Category category : values()) {
            if (category.name().equalsIgnoreCase(value)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Unknown category: " + value);
    }
}

@JsonValue
public String toValue() {
    return this.name().toLowerCase(); // Or keep uppercase if preferred
}
}