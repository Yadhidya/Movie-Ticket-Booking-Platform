package com.smart.ticketbooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private final ConcurrentHashMap<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        
        OtpData otpData = new OtpData(otp, LocalDateTime.now().plusMinutes(5));
        otpStorage.put(email, otpData);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for MovieHub Registration");
        message.setText("Your OTP is: " + otp + "\nIt will expire in 5 minutes.");
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            return false;
        }
        if (otpData.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpStorage.remove(email);
            return false;
        }
        if (otpData.getOtp().equals(otp)) {
            otpStorage.remove(email);
            return true;
        }
        return false;
    }

    private static class OtpData {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() { return otp; }
        public LocalDateTime getExpiryTime() { return expiryTime; }
    }
}
