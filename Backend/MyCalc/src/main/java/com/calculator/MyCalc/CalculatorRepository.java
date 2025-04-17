package com.calculator.MyCalc;

import org.springframework.data.jpa.repository.JpaRepository;


public interface CalculatorRepository extends JpaRepository<CalculatorEntity, Integer> 
{
}
