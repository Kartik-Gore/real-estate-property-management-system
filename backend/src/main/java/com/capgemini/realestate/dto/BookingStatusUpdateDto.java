package com.capgemini.realestate.dto;

import com.capgemini.realestate.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class BookingStatusUpdateDto {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    public BookingStatusUpdateDto() {
    }

    public BookingStatusUpdateDto(BookingStatus status) {
        this.status = status;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}
