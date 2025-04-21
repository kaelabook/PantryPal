package PantryPal.PantryPal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RecipeDTO {
    private Long id;
    private String name;
    private String description;
    private Integer cookTime;
    private Integer temperature;
    private Integer servings;
    private String instructions;
    private List<RecipeIngredientDTO> ingredients;

    // Getters and setters with @JsonProperty
    @JsonProperty("id")
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonProperty("name")
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @JsonProperty("description")
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @JsonProperty("cookTime")
    public Integer getCookTime() { return cookTime; }
    public void setCookTime(Integer cookTime) { this.cookTime = cookTime; }

    @JsonProperty("temperature")
    public Integer getTemperature() { return temperature; }
    public void setTemperature(Integer temperature) { this.temperature = temperature; }

    @JsonProperty("servings")
    public Integer getServings() { return servings; }
    public void setServings(Integer servings) { this.servings = servings; }

    @JsonProperty("instructions")
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    @JsonProperty("ingredients")
    public List<RecipeIngredientDTO> getIngredients() { return ingredients; }
    public void setIngredients(List<RecipeIngredientDTO> ingredients) { this.ingredients = ingredients; }
}