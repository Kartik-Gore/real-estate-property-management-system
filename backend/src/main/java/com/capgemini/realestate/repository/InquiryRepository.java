package com.capgemini.realestate.repository;

import com.capgemini.realestate.entity.Inquiry;
import com.capgemini.realestate.entity.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Inquiry> findByPropertyOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Inquiry> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    long countByStatus(InquiryStatus status);
}
