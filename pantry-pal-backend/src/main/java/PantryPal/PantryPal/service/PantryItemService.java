package com.pantrypal.service;

import com.pantrypal.dto.PantryItemDTO;
import com.pantrypal.model.PantryItem;
import com.pantrypal.repository.PantryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PantryItemService {
    private final PantryItemRepository pantryItemRepository;

    @Autowired
    public PantryItemService(PantryItemRepository pantryItemRepository) {
        this.pantryItemRepository = pantryItemRepository;
    }

    public List<PantryItemDTO> getPantryItemsForUser(Long userId) {
        List<PantryItem> items = pantryItemRepository.findByUserId(userId);
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PantryItemDTO addPantryItem(PantryItemDTO itemDTO) {
        PantryItem item = new PantryItem();
        item.setUserId(itemDTO.getUserId());
        item.setName(itemDTO.getName());
        item.setCategory(itemDTO.getCategory());
        item.setQuantity(itemDTO.getQuantity());
        item.setUnit(itemDTO.getUnit());

        PantryItem savedItem = pantryItemRepository.save(item);
        return convertToDTO(savedItem);
    }

    public PantryItemDTO updatePantryItem(Long id, PantryItemDTO itemDTO) {
        PantryItem existingItem = pantryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pantry item not found"));

        existingItem.setName(itemDTO.getName());
        existingItem.setCategory(itemDTO.getCategory());
        existingItem.setQuantity(itemDTO.getQuantity());
        existingItem.setUnit(itemDTO.getUnit());

        PantryItem updatedItem = pantryItemRepository.save(existingItem);
        return convertToDTO(updatedItem);
    }

    public void deletePantryItem(Long id) {
        pantryItemRepository.deleteById(id);
    }

    private PantryItemDTO convertToDTO(PantryItem item) {
        PantryItemDTO dto = new PantryItemDTO();
        dto.setId(item.getId());
        dto.setUserId(item.getUserId());
        dto.setName(item.getName());
        dto.setCategory(item.getCategory());
        dto.setQuantity(item.getQuantity());
        dto.setUnit(item.getUnit());
        return dto;
    }
}