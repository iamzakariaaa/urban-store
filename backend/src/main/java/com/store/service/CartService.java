package com.store.service;


import com.store.dto.CartItemRequest;
import com.store.model.CartItem;
import com.store.model.Product;
import com.store.model.User;
import com.store.repository.CartItemRepository;
import com.store.repository.ProductRepository;
import com.store.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

    public boolean addToCart(String userId, CartItemRequest request){
        Optional<Product> productOpt = productRepository.findById(request.getProductId());
        if (productOpt.isEmpty())
            return false;

        Product product = productOpt.get();
        if(product.getStockQuantity() < request.getQuantity())
            return false;

        Optional<User> userOpt = userRepository.findById(Long.valueOf(userId));
        if (userOpt.isEmpty())
            return false;

        User user = userOpt.get();

        CartItem existingCartItem = cartItemRepository.findByUserAndProduct(user,product);
        if (existingCartItem != null){
            existingCartItem.setQuantity(existingCartItem.getQuantity() + request.getQuantity());
            existingCartItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(existingCartItem.getQuantity())));
            cartItemRepository.save(existingCartItem);
        }else{
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
            cartItemRepository.save(cartItem);
        }
        return true;
    }

    public boolean updateCartItem(String userId, Long productId, int newQuantity) {
        if (newQuantity <= 0) return false;

        Optional<User> userOpt = userRepository.findById(Long.valueOf(userId));
        Optional<Product> productOpt = productRepository.findById(productId);

        if (userOpt.isEmpty() || productOpt.isEmpty()) return false;

        CartItem cartItem = cartItemRepository.findByUserAndProduct(userOpt.get(), productOpt.get());
        if (cartItem == null) return false;

        Product product = productOpt.get();
        if (product.getStockQuantity() < newQuantity) return false;

        cartItem.setQuantity(newQuantity);
        cartItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(newQuantity)));
        cartItemRepository.save(cartItem);

        return true;
    }


    public List<CartItem> getCart(String userId) {
        return userRepository.findById(Long.valueOf(userId)).map(cartItemRepository::findByUser).orElseGet(List::of);
    }

    public boolean deleteItemFromCart(String userId, Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        Optional<User> userOpt = userRepository.findById(Long.valueOf(userId));
        if (productOpt.isPresent() && userOpt.isPresent()){
            cartItemRepository.deleteByUserAndProduct(userOpt.get(),productOpt.get());
            return true;
        }
        return false;
    }
    public void clearCart(String userId) {
        userRepository.findById(Long.valueOf(userId)).ifPresent(cartItemRepository::deleteByUser);
    }
}


