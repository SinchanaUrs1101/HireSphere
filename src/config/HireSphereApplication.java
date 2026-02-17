package config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"config", "controller", "api"})
public class HireSphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(HireSphereApplication.class, args);
    }
}
