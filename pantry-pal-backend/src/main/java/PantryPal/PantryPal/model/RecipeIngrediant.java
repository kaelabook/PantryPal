package com.pantrypal.model;
import jakarta.persistence.*;

@Entity
@Table(name = "recipe_ingredients")
public class RecipeIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Double quantity;
    private String unit;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;
    
    public Long getId() {
        return id;}

    public void setId(Long id) {
        this.id = id;}

    public String getName() {
        return name;}

    public void setName(String name) {
        this.name = name;}

    public Double getQuantity() {
        return quantity;}

    public void setQuantity(Double quantity) {
        this.quantity = quantity;}

    public String getUnit() {
        return unit;}

    public void setUnit(String unit) {
        this.unit = unit;}

    public Recipe getRecipe() {
        return recipe;}

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;}
}
