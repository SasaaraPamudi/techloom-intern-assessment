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

    public EntityDTOConversion(ModelMapper modelMapper){
        this.modelMapper = modelMapper;
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
    }

    //product
    public ProductDTO toProductDTO(ProductEntity product){
        return modelMapper.map(product, ProductDTO.class);

    }
    public ProductEntity toProductEntity(ProductDTO dto){
        return modelMapper.map(dto, ProductEntity.class);
    }


    public List<ProductDTO> toProductDTOList(List<ProductEntity> allProducts) {
        return modelMapper.map(allProducts, new TypeToken<List<ProductDTO>>() {}.getType());
    }

    //Reservation

    public ReservationDTO toReservationDTO(ReservationEntity reservation) {
        return modelMapper.map(reservation, ReservationDTO.class);
    }

    //Order

    public OrderDTO toOrderDTO(OrderEntity order) {
        return modelMapper.map(order, OrderDTO.class);
    }
}
