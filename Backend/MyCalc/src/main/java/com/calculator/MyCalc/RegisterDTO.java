package com.calculator.MyCalc;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterDTO
{
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 8, message = "Username must be at least 8 characters")
    @Pattern(
        regexp = "^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)(?=[^@$!%*?&#^]*[@$!%*?&#^])[A-Za-z\\d@$!%*?&#^]{8,}$",
        message = "Username must contain: 1 uppercase, 1 lowercase, 1 digit, 1 special character"
    )
    private String username;
    
    @NotBlank(message = "Password cannot be blank")
    @Size(min=8, message = "Password length must be 8 Characters")
    private String password;
    
    @NotBlank(message = "Role cannot be blank")
    private String role;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
