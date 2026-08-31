# Stage 1: Build stage
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy pom.xml and download dependencies for layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build packaged JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production runtime stage
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Create a non-root system user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create resume uploads directory and set permissions
RUN mkdir -p /app/uploads/resumes && chown -R appuser:appgroup /app

# Copy the packaged Spring Boot executable JAR from the builder stage
COPY --from=builder --chown=appuser:appgroup /build/target/backend-0.0.1-SNAPSHOT.jar app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
