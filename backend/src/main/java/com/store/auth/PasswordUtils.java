package com.store.auth;

import java.util.Base64;

public class PasswordUtils {
    public static String hash(String password) {
        return Base64.getEncoder().encodeToString(password.getBytes()); // use BCrypt for production
    }

    public static boolean match(String raw, String hashed) {
        return hash(raw).equals(hashed);
    }
}

