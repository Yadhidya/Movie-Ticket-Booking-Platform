package com.smart.ticketbooking.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final JavaMailSender mailSender;
    private final ConcurrentHashMap<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    // Constructor injection preferred over field @Autowired
    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void generateAndSendOtp(String email) {
        // Secure random generation prevents predictive pattern attacks
        int code = secureRandom.nextInt(1000000);
        String otp = String.format("%06d", code);
        
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

        // Token has expired
        if (otpData.expiryTime().isBefore(LocalDateTime.now())) {
            otpStorage.remove(email);
            return false;
        }

        // Matches valid token
        if (otpData.otp().equals(otp)) {
            otpStorage.remove(email);
            return true;
        }

        return false;
    }

    // Evicts dead cache pairs every 5 minutes to prevent long-term memory leaks
    @Scheduled(fixedRate = 300000)
    public void cleanExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();
        otpStorage.entrySet().removeIf(entry -> entry.getValue().expiryTime().isBefore(now));
    }

    // Using Java Record for cleaner boilerplate code
    private record OtpData(String otp, LocalDateTime expiryTime) {}
}
