package com.store.service;

import com.store.dto.OrderItemDTO;
import com.store.dto.OrderResponse;
import com.store.model.*;
import com.store.repository.OrderRepository;
import com.store.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Service
public class OrderService {
    @Autowired
    private CartService cartService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;

    public Optional<OrderResponse> createOrder(String userId) {
        //Items Validation
        List<CartItem> cartItems = cartService.getCart(userId);
        if (cartItems.isEmpty()) {
            return Optional.empty();
        }
        //Customers Validation
        Optional<User> userOptional = userRepository.findById(Long.valueOf(userId));
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }
        User user = userOptional.get();
        //Total Price
        BigDecimal totalPrice = cartItems.stream()
                .map(CartItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        //Create Order
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(totalPrice);

        List<OrderItem> orderItems = cartItems.stream()
                .map(item -> new OrderItem(
                        null,
                        item.getProduct(),
                        item.getQuantity(),
                        item.getPrice(),
                        order
                ))
                .toList();

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);
        //Clear Cart
        cartService.clearCart(userId);
        return Optional.of(mapToOrderResponse(savedOrder));
    }
        private OrderResponse mapToOrderResponse(Order order) {
            return new OrderResponse(
                    order.getId(),
                    order.getTotalAmount(),
                    order.getStatus(),
                    order.getItems().stream()
                            .map(orderItem -> new OrderItemDTO(
                                    orderItem.getId(),
                                    orderItem.getProduct().getId(),
                                    orderItem.getQuantity(),
                                    orderItem.getPrice(),
                                    orderItem.getPrice().multiply(new BigDecimal(orderItem.getQuantity()))
                            ))
                            .toList(),
                    order.getCreatedAt()
            );
        }

    }
