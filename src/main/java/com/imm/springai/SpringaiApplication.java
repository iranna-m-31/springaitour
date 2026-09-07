package com.imm.springai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringaiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringaiApplication.class, args);
	}

//	@Bean
//	public CommandLineRunner runner(ChatClient.Builder builder) {
//		return args -> {
//			// Build the chat client using the autoconfigured builder
//			ChatClient chatClient = builder.build();
//
//			// Fetch response from the LLM
//			String response = chatClient.prompt()
//				.user("Tell me a joke")
//				.call()
//				.content();
//
//			System.out.println("AI Response: " + response);
//		};
//	}
}
