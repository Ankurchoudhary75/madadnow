package com.madadnow.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {

    // 📡 LIVE USERS
    private static final List<Map<String, Object>> liveLocations = new ArrayList<>();

    // 🚨 SOS API
    @PostMapping
    public ResponseEntity<?> triggerEmergency(
            @RequestBody Map<String, Object> data) {

        System.out.println("🚨 Emergency Triggered: " + data);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Emergency triggered successfully"));
    }

    // 📡 UPDATE LIVE LOCATION
    @PostMapping("/update-location")
    public ResponseEntity<?> updateLocation(
            @RequestBody Map<String, Object> data) {

        try {

            System.out.println("📡 LIVE LOCATION: " + data);

            liveLocations.clear();

            liveLocations.add(data);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Location updated",
                            "data", data));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error",
                            e.getMessage()));
        }
    }

    // 📍 GET LIVE LOCATIONS
    @GetMapping("/live-locations")
    public ResponseEntity<?> getLiveLocations() {

        return ResponseEntity.ok(liveLocations);
    }
}