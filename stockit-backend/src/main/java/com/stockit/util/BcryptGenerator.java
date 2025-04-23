package com.stockit.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String jaimePass = "Jaime0811-";
        String manuelPass = "12345";
        String marcosPass = "12345";

        System.out.println("Jaime: " + encoder.encode(jaimePass));
        System.out.println("Manuel: " + encoder.encode(manuelPass));
        System.out.println("Marcos: " + encoder.encode(marcosPass));
    }
}