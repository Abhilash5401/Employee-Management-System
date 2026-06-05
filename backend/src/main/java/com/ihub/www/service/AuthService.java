package com.ihub.www.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihub.www.model.Employee;
import com.ihub.www.model.User;
import com.ihub.www.repo.EmployeeRepository;
import com.ihub.www.repo.UserRepository;

@Service
public class AuthService {

    // Secret key — only backend developer knows this
    private static final String ADMIN_SECRET_KEY = "BRIDGESOFT@ADMIN2025";

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    public Map<String, Object> login(String username, String password) {
        Map<String, Object> response = new HashMap<>();

        // Check admin users table first
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            response.put("success", true);
            response.put("role", "ADMIN");
            response.put("name", username);
            return response;
        }

        // Check employee table
        List<Employee> employees = employeeRepository.findAll();
        for (Employee emp : employees) {
            if (username.equals(emp.getUsername()) && password.equals(emp.getPassword())) {
                response.put("success", true);
                response.put("role", "EMPLOYEE");
                response.put("employeeId", emp.getId());
                response.put("name", emp.getName());
                return response;
            }
        }

        response.put("success", false);
        return response;
    }

    public Map<String, Object> register(String username, String password, String secretKey) {
        Map<String, Object> response = new HashMap<>();

        // Validate secret key
        if (!ADMIN_SECRET_KEY.equals(secretKey)) {
            response.put("success", false);
            response.put("message", "Invalid secret key. Access denied.");
            return response;
        }

        // Check if username already exists
        User existingUser = userRepository.findByUsername(username);
        if (existingUser != null) {
            response.put("success", false);
            response.put("message", "Username already exists. Please choose another.");
            return response;
        }

        // Validate username and password
        if (username == null || username.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Username cannot be empty.");
            return response;
        }

        if (password == null || password.length() < 6) {
            response.put("success", false);
            response.put("message", "Password must be at least 6 characters.");
            return response;
        }

        // Create new admin user
        User newUser = new User();
        newUser.setUsername(username.trim());
        newUser.setPassword(password);
        userRepository.save(newUser);

        response.put("success", true);
        response.put("message", "Admin account created successfully!");
        return response;
    }
}
