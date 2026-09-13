FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY build/libs/backend-*.jar app.jar
EXPOSE ${PORT:-8080}
ENTRYPOINT ["java","-jar","app.jar"]