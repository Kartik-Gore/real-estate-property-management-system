package com.capgemini.realestate.controller;

import com.capgemini.realestate.dto.ApiResponse;
import com.capgemini.realestate.dto.InquiryReplyDto;
import com.capgemini.realestate.dto.InquiryRequestDto;
import com.capgemini.realestate.dto.InquiryResponseDto;
import com.capgemini.realestate.service.InquiryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<InquiryResponseDto> createInquiry(
            @Valid @RequestBody InquiryRequestDto dto,
            Authentication authentication
    ) {
        InquiryResponseDto inquiry = inquiryService.createInquiry(dto, authentication.getName());
        return new ResponseEntity<>(inquiry, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<InquiryResponseDto>> getMyInquiries(Authentication authentication) {
        return ResponseEntity.ok(inquiryService.getMyInquiries(authentication.getName()));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<List<InquiryResponseDto>> getOwnerInquiries(Authentication authentication) {
        return ResponseEntity.ok(inquiryService.getOwnerInquiries(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InquiryResponseDto>> getAllInquiries() {
        return ResponseEntity.ok(inquiryService.getAllInquiries());
    }

    @PutMapping("/{id}/reply")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<InquiryResponseDto> replyToInquiry(
            @PathVariable Long id,
            @Valid @RequestBody InquiryReplyDto dto,
            Authentication authentication
    ) {
        InquiryResponseDto replied = inquiryService.replyToInquiry(id, dto.getResponse(), authentication.getName());
        return ResponseEntity.ok(replied);
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<InquiryResponseDto> closeInquiry(
            @PathVariable Long id,
            Authentication authentication
    ) {
        InquiryResponseDto closed = inquiryService.closeInquiry(id, authentication.getName());
        return ResponseEntity.ok(closed);
    }
}
