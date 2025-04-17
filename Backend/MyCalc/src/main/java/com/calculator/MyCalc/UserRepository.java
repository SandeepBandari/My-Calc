package com.calculator.MyCalc;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User_Data, Long> {
    Optional<User_Data> findByUsername(String username);
}
