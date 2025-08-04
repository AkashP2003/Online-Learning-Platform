package com.notification.controller;

import com.notification.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/send-offer-emails")
    public String sendOfferEmailsNow() {
        notificationService.notifyUsersAboutOffers();
        return "Notifications sent (manual trigger).";
    }

//    @Scheduled(cron = "0 0 9 * * *")
    @Scheduled(cron = "0 */5 * * * *")
    public void scheduleDailyOfferEmails() {
        notificationService.notifyUsersAboutOffers();
    }
}
