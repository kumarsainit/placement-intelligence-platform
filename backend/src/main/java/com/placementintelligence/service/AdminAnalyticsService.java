package com.placementintelligence.service;

import com.placementintelligence.dto.response.AdminAnalyticsResponse;

public interface AdminAnalyticsService {

    AdminAnalyticsResponse getOverview(String username);
}
