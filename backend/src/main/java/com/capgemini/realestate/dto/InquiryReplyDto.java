package com.capgemini.realestate.dto;

import jakarta.validation.constraints.NotBlank;

public class InquiryReplyDto {

    @NotBlank(message = "Response message cannot be blank")
    private String response;

    public InquiryReplyDto() {
    }

    public InquiryReplyDto(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}
