package com.pantrypal.model;
import jakarta.persistence.*;

@Entity
@Table(name = "shopping_cart")
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    private String name;
    private Double quantity;
    private String unit;
    
    @Enumerated(EnumType.STRING)
    private IngredientCategory category;
    
    public Long getId() {
        return id;}

    public void setId(Long id) {
        this.id = id;}

    public Long getUserId() {
        return userId;}

    public void setUserId(Long userId) {
        this.userId = userId;}

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

    public IngredientCategory getCategory() {
        return category;}

    public void setCategory(IngredientCategory category) {
        this.category = category;}
}
