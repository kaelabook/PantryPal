package PantryPal.PantryPal.service;

import PantryPal.PantryPal.dto.PantryItemDTO;
import PantryPal.PantryPal.model.PantryItem;
import PantryPal.PantryPal.model.Category;
import PantryPal.PantryPal.repository.PantryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PantryItemService {
    private final PantryItemRepository pantryItemRepository;
    private final ValidationService validationService;

    public PantryItemService(PantryItemRepository pantryItemRepository,
                           ValidationService validationService) {
        this.pantryItemRepository = pantryItemRepository;
        this.validationService = validationService;
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

    @Transactional
    public PantryItemDTO createOrUpdateItem(PantryItemDTO pantryItemDTO) {
        String unit = (pantryItemDTO.getUnit() == null || pantryItemDTO.getUnit().trim().isEmpty()) 
            ? "" 
            : pantryItemDTO.getUnit().trim();

        Optional<PantryItem> existingItem = pantryItemRepository.findByNameAndCategoryAndUnitIgnoreCase(
            pantryItemDTO.getName().trim(),
            pantryItemDTO.getCategory(),
            unit);

        PantryItem item;
        if (existingItem.isPresent()) {
            item = existingItem.get();
            item.setQuantity(item.getQuantity() + pantryItemDTO.getQuantity());
        } else {
            item = new PantryItem();
            item.setName(pantryItemDTO.getName().trim());
            item.setCategory(pantryItemDTO.getCategory());
            item.setQuantity(pantryItemDTO.getQuantity());
            item.setUnit(unit);
            item.setUserId(pantryItemDTO.getUserId());
        }

        ValidationService.ValidationResult validation = validationService.validatePantryItem(
            item, 
            pantryItemRepository.findAll()
                .stream()
                .filter(i -> !i.getId().equals(item.getId()))
                .collect(Collectors.toList()));

        if (!validation.isValid()) {
            throw new IllegalArgumentException(String.join(", ", validation.getErrors()));
        }

        PantryItem savedItem = pantryItemRepository.save(item);
        return convertToDTO(savedItem);
    }

    @Transactional
    public PantryItemDTO updateItem(Long id, PantryItemDTO pantryItemDTO) {
        PantryItem existingItem = pantryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pantry item not found"));

        String unit = (pantryItemDTO.getUnit() == null || pantryItemDTO.getUnit().trim().isEmpty()) 
            ? "" 
            : pantryItemDTO.getUnit().trim();

        existingItem.setName(pantryItemDTO.getName().trim());
        existingItem.setCategory(pantryItemDTO.getCategory());
        existingItem.setQuantity(pantryItemDTO.getQuantity());
        existingItem.setUnit(unit);

        ValidationService.ValidationResult validation = validationService.validatePantryItem(
            existingItem, 
            pantryItemRepository.findAll()
                .stream()
                .filter(i -> !i.getId().equals(existingItem.getId()))
                .collect(Collectors.toList()));

        if (!validation.isValid()) {
            throw new IllegalArgumentException(String.join(", ", validation.getErrors()));
        }

        PantryItem updatedItem = pantryItemRepository.save(existingItem);
        return convertToDTO(updatedItem);
    }

    @Transactional
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

    public List<PantryItemDTO> getItemsByCategory(Category category) {
        return pantryItemRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}