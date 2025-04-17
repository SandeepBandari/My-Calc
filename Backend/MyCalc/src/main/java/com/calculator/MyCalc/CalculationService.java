package com.calculator.MyCalc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CalculationService {

    private static final Logger logger = LoggerFactory.getLogger(CalculationService.class);

    @Autowired
    private CalculatorRepository calculatorRepository; // Autowire the repository

    @Transactional
    public CalculatorEntity operation(String operationtype, double value1, double value2) throws Exception {
        logger.info("Performing operation: {} with values: {}, {}", operationtype, value1, value2);

        double result = 0;
        switch (operationtype) {
            case "add":
                result = value1 + value2;
                break;
            case "sub":
                result = value1 - value2;
                break;
            case "mul":
                result = value1 * value2;
                break;
            case "modulus":  
                result = value1 % value2;
                break;
            case "div":
                if (value2 == 0) {
                    throw new Exception("Division by zero is not allowed");
                }
                result = value1 / value2;
                break;
            default:
                throw new Exception("Invalid operation type");
        }

        // Create a new CalculatorEntity object
        CalculatorEntity calculatorEntity = new CalculatorEntity(value1, value2, operationtype, result);

        // Save the entity to the database using the repository
        if (calculatorRepository == null) {
            logger.error("CalculatorRepository is null!");
            throw new RuntimeException("CalculatorRepository is not autowired!");
        }

        calculatorRepository.save(calculatorEntity);
        logger.info("Operation result saved to database: {}", calculatorEntity);

        return calculatorEntity;
    }

    @Transactional(readOnly = true)
    public List<CalculatorEntity> getCal_History() {
        logger.info("Retrieving calculation history from database");
        return calculatorRepository.findAll();
    }
}