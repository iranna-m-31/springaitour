FROM amazoncorretto:25-jdk
WORKDIR /app
COPY build/libs/spring-ai-*.jar app.jar
EXPOSE ${PORT:-8080}
ENTRYPOINT ["java","-jar","app.jar"]
