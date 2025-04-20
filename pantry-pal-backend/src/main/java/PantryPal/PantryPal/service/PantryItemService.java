package PantryPal.PantryPal.service;

import PantryPal.PantryPal.dto.PantryItemDTO;
import PantryPal.PantryPal.model.PantryItem;
import PantryPal.PantryPal.repository.PantryItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PantryItemService {
    private final PantryItemRepository pantryItemRepository;

    public PantryItemService(PantryItemRepository pantryItemRepository) {
        this.pantryItemRepository = pantryItemRepository;
    }

    public List<PantryItemDTO> getAllItems() {
        return pantryItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PantryItemDTO> getAllItemsForUser(Long userId) {
        return pantryItemRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PantryItemDTO getItemById(Long id) {
        return pantryItemRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Pantry item not found"));
    }

    public PantryItemDTO createItem(PantryItemDTO pantryItemDTO) {
        PantryItem pantryItem = new PantryItem();
        pantryItem.setUserId(pantryItemDTO.getUserId());
        pantryItem.setName(pantryItemDTO.getName());
        pantryItem.setCategory(pantryItemDTO.getCategory());
        pantryItem.setQuantity(pantryItemDTO.getQuantity());
        pantryItem.setUnit(pantryItemDTO.getUnit());

        PantryItem savedItem = pantryItemRepository.save(pantryItem);
        return convertToDTO(savedItem);
    }

    public PantryItemDTO updateItem(Long id, PantryItemDTO pantryItemDTO) {
        PantryItem existingItem = pantryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pantry item not found"));

        existingItem.setName(pantryItemDTO.getName());
        existingItem.setCategory(pantryItemDTO.getCategory());
        existingItem.setQuantity(pantryItemDTO.getQuantity());
        existingItem.setUnit(pantryItemDTO.getUnit());

        PantryItem updatedItem = pantryItemRepository.save(existingItem);
        return convertToDTO(updatedItem);
    }

    public void deleteItem(Long id) {
        pantryItemRepository.deleteById(id);
    }

    private PantryItemDTO convertToDTO(PantryItem pantryItem) {
        PantryItemDTO dto = new PantryItemDTO();
        dto.setId(pantryItem.getId());
        dto.setUserId(pantryItem.getUserId());
        dto.setName(pantryItem.getName());
        dto.setCategory(pantryItem.getCategory());
        dto.setQuantity(pantryItem.getQuantity());
        dto.setUnit(pantryItem.getUnit());
        return dto;
    }
}