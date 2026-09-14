package com.techloomai.pos_system.util;

import com.techloomai.pos_system.DTO.OrderDTO;
import com.techloomai.pos_system.DTO.ProductDTO;
import com.techloomai.pos_system.DTO.ReservationDTO;
import com.techloomai.pos_system.Entity.OrderEntity;
import com.techloomai.pos_system.Entity.ProductEntity;
import com.techloomai.pos_system.Entity.ReservationEntity;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EntityDTOConversion {
    private final ModelMapper modelMapper;

    public EntityDTOConversion(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        this.modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STANDARD)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);
    }

    public ProductDTO toProductDTO(ProductEntity product) {
        if (product == null) return null;
        return modelMapper.map(product, ProductDTO.class);
    }

    public ProductEntity toProductEntity(ProductDTO dto) {
        if (dto == null) return null;
        return modelMapper.map(dto, ProductEntity.class);
    }

    public List<ProductDTO> toProductDTOList(List<ProductEntity> allProducts) {
        return modelMapper.map(allProducts, new TypeToken<List<ProductDTO>>() {}.getType());
    }

    public ReservationDTO toReservationDTO(ReservationEntity reservation) {
        if (reservation == null) return null;
        return modelMapper.map(reservation, ReservationDTO.class);
    }

    public OrderDTO toOrderDTO(OrderEntity order) {
        if (order == null) return null;
        return modelMapper.map(order, OrderDTO.class);
    }

    public List<OrderDTO> toOrderDTOList(List<OrderEntity> allOrders) {
        return modelMapper.map(allOrders, new TypeToken<List<OrderDTO>>() {}.getType());
    }
}