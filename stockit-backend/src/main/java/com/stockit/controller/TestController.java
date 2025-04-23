package com.stockit.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @PostMapping("/ping")
    public String ping(@RequestBody(required = false) String body) {
        return "pong";
    }
}