package com.imm.springai;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;

/**
 * SPA fallback controller.
 * For any non-API route that reaches the server, serve index.html
 * so the React Router can take over client-side routing.
 */
@Controller
public class SpaController {

    @GetMapping(value = {
        "/introduction",
        "/download",
        "/settings",
        "/call-log",
        "/playground",
        "/home",
        "/feature/**"
    })
    public String spaFallback(HttpServletRequest request) {
        // Forward to index.html for SPA routing
        return "forward:/index.html";
    }
}
