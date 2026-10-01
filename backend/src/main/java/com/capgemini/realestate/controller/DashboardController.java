package com.capgemini.realestate.controller;

import com.capgemini.realestate.dto.DashboardStatsDto;
import com.capgemini.realestate.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats/public")
    public ResponseEntity<DashboardStatsDto> getPublicStats() {
        return ResponseEntity.ok(dashboardService.getPublicStats());
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDto> getAdminStats() {
        return ResponseEntity.ok(dashboardService.getAdminStats());
    }

    @GetMapping("/owner/stats")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<DashboardStatsDto> getOwnerStats(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getOwnerStats(authentication.getName()));
    }
}
