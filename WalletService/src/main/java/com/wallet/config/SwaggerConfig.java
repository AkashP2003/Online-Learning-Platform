package com.wallet.config;

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
                        .title("Wallet Service")
                        .description("Wallet Service using Spring Boot")
                        .version("1.0.0")
                );
    }
}
