package com.offers.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI myOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Offer Service")
                        .description("Offer service using Spring Boot")
                        .version("1.0.0")
                );
    }
}
