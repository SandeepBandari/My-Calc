package com.calculator.MyCalc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registerUser(User_Data user)
    {
        // Check if the username already exists
    	
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Already registered with this username");
        }

        // Hash the password and save the user
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            // Handle database-level uniqueness violation
            throw new RuntimeException("Already registered with this username");
        }
    }
}