package com.capgemini.realestate.dto;

import com.capgemini.realestate.entity.Inquiry;
import com.capgemini.realestate.entity.InquiryStatus;

import java.time.LocalDateTime;

public class InquiryResponseDto {
    private Long id;
    private PropertyDto property;
    private UserDto user;
    private String subject;
    private String message;
    private String response;
    private InquiryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime repliedAt;

    public InquiryResponseDto() {
    }

    public static InquiryResponseDto fromEntity(Inquiry inquiry) {
        if (inquiry == null) return null;
        InquiryResponseDto dto = new InquiryResponseDto();
        dto.setId(inquiry.getId());
        dto.setProperty(PropertyDto.fromEntity(inquiry.getProperty()));
        dto.setUser(UserDto.fromEntity(inquiry.getUser()));
        dto.setSubject(inquiry.getSubject());
        dto.setMessage(inquiry.getMessage());
        dto.setResponse(inquiry.getResponse());
        dto.setStatus(inquiry.getStatus());
        dto.setCreatedAt(inquiry.getCreatedAt());
        dto.setRepliedAt(inquiry.getRepliedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PropertyDto getProperty() {
        return property;
    }

    public void setProperty(PropertyDto property) {
        this.property = property;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public InquiryStatus getStatus() {
        return status;
    }

    public void setStatus(InquiryStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getRepliedAt() {
        return repliedAt;
    }

    public void setRepliedAt(LocalDateTime repliedAt) {
        this.repliedAt = repliedAt;
    }
}
