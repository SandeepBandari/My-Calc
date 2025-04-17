package com.calculator.MyCalc;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class User_Data {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 8, message = "Username must be at least 8 characters")
    @Pattern(
        regexp = "^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)(?=[^@$!%*?&#^]*[@$!%*?&#^])[A-Za-z\\d@$!%*?&#^]{8,}$",
        message = "Username must contain :1 uppercase, 1 lowercase, 1 digit, 1 special character "
    )
    
    private String username;
    
    @NotNull(message = "Password Cannot be Null")
    @Size(min=8, message = "Password length must be 8 Characters")
    private String password;
    private String role; // Roles: USER, ADMIN

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
