package com.madadnow.backend.utils;

import java.util.HashMap;
import java.util.Map;

public class RateLimiter {

    private static final Map<String, Long> requestMap = new HashMap<>();
    private static final long LIMIT_INTERVAL = 5000; // 5 seconds

    public static boolean allowRequest(String key) {

        long currentTime = System.currentTimeMillis();

        if (!requestMap.containsKey(key)) {
            requestMap.put(key, currentTime);
            return true;
        }

        long lastTime = requestMap.get(key);

        if (currentTime - lastTime > LIMIT_INTERVAL) {
            requestMap.put(key, currentTime);
            return true;
        }

        return false;
    }
}