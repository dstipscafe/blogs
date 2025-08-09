---
title: "Meeting Java: Building a Bot with Maven"
description: "A beginner's notes on packaging a Telegram bot with Fat and Thin JARs."
slug: java_maven_journey
date: 2025-06-05 11:00:00+0800
image: image.png
categories:
    - blogs
tags:
    - blogs
    - Java
    - Maven
    - JAR
---

## Preface

I recently started learning Java for upcoming projects.  The best way to learn a language is to build something, so I created a Telegram bot and explored how Maven packages applications.

## Fat vs. Thin JAR

* **Fat JAR** (Uber‑Jar): all classes and dependencies bundled into one large file—easy to deploy but big.
* **Thin JAR**: only compiled classes included; dependencies remain external, saving space at the cost of management complexity.

## Project Setup

A project skeleton is generated with `maven-archetype-quick`.  The structure resembles:

```text
telegram_bot
├── pom.xml
├── src/main/java/com/telegram_bot
│   ├── Main.java
│   └── Bot.java
```

`Bot.java` handles Telegram API interactions while `Main.java` launches the bot.

## Packaging

### Fat JAR with Maven Shade

Add the `maven-shade-plugin` to `pom.xml` to create a single executable JAR:

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-shade-plugin</artifactId>
  <version>3.5.0</version>
  <executions>
    <execution>
      <phase>package</phase>
      <goals><goal>shade</goal></goals>
      <configuration>
        <transformers>
          <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
            <mainClass>com.telegram_bot.Main</mainClass>
          </transformer>
        </transformers>
      </configuration>
    </execution>
  </executions>
</plugin>
```

### Thin JAR

For a slimmer artifact, package only project classes and supply dependencies on the classpath at runtime.

## Running the Bot

Build the project with `mvn package` and run the resulting JAR:

```shell
java -jar target/telegram_bot-1.0-SNAPSHOT.jar
```

## Conclusion

Exploring Maven's packaging options clarified the difference between Fat and Thin JARs and helped me publish a working Telegram bot.
