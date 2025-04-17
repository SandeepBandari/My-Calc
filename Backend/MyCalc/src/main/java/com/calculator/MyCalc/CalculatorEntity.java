package com.calculator.MyCalc;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CalculatorEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int s_no;
    private double value1;
    private double value2;
    private String operationtype;
    private double result;

    public CalculatorEntity() {
        // Default constructor
    }

    public CalculatorEntity(double value1, double value2, String operationtype, double result) {
        this.value1 = value1;
        this.value2 = value2;
        this.operationtype = operationtype;
        this.result = result;
    }

    // Getters and setters
    public int getS_no() {
        return s_no;
    }

    public void setS_no(int s_no) {
        this.s_no = s_no;
    }

    public double getValue1() {
        return value1;
    }

    public void setValue1(double value1) {
        this.value1 = value1;
    }

    public double getValue2() {
        return value2;
    }

    public void setValue2(double value2) {
        this.value2 = value2;
    }

    public String getOperationtype() {
        return operationtype;
    }

    public void setOperationtype(String operationtype) {
        this.operationtype = operationtype;
    }

    public double getResult() {
        return result;
    }

    public void setResult(double result) {
        this.result = result;
    }
}