package com.ihub.www.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihub.www.model.User;
import com.ihub.www.repo.UserRepository;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;

    /**
     * BUG FIX: Original code used == for String comparison which always returns false
     * for non-interned strings. Fixed to use .equals().
     */
    public boolean login(String username, String password) {
        User user = userRepository.findByUsername(username);

        if (user == null) return false;

        return user.getPassword().equals(password);
    }
}
