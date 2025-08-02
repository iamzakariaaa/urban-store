package com.store.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String firstName, lastName, email, phone, password;
}
