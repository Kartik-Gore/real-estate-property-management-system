package com.capgemini.realestate.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStatsDto {
    private long totalProperties;
    private long availableProperties;
    private long rentedProperties;
    private long soldProperties;
    private long totalUsers;
    private long totalCustomers;
    private long totalOwners;
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long totalInquiries;
    private long openInquiries;
    private BigDecimal totalRevenue;
    private Map<String, Long> propertiesByType;

    public DashboardStatsDto() {
    }

    public long getTotalProperties() {
        return totalProperties;
    }

    public void setTotalProperties(long totalProperties) {
        this.totalProperties = totalProperties;
    }

    public long getAvailableProperties() {
        return availableProperties;
    }

    public void setAvailableProperties(long availableProperties) {
        this.availableProperties = availableProperties;
    }

    public long getRentedProperties() {
        return rentedProperties;
    }

    public void setRentedProperties(long rentedProperties) {
        this.rentedProperties = rentedProperties;
    }

    public long getSoldProperties() {
        return soldProperties;
    }

    public void setSoldProperties(long soldProperties) {
        this.soldProperties = soldProperties;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalOwners() {
        return totalOwners;
    }

    public void setTotalOwners(long totalOwners) {
        this.totalOwners = totalOwners;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getPendingBookings() {
        return pendingBookings;
    }

    public void setPendingBookings(long pendingBookings) {
        this.pendingBookings = pendingBookings;
    }

    public long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public long getTotalInquiries() {
        return totalInquiries;
    }

    public void setTotalInquiries(long totalInquiries) {
        this.totalInquiries = totalInquiries;
    }

    public long getOpenInquiries() {
        return openInquiries;
    }

    public void setOpenInquiries(long openInquiries) {
        this.openInquiries = openInquiries;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Map<String, Long> getPropertiesByType() {
        return propertiesByType;
    }

    public void setPropertiesByType(Map<String, Long> propertiesByType) {
        this.propertiesByType = propertiesByType;
    }
}
