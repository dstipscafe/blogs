---
title: "與Java的邂逅，從一個機器人開始"
description: "一個Java小白，學習如何使用Maven的心得分享"
slug: java_maven_journey
date: 2025-06-5 11:00:00+0800
image: image.png
categories:
    - blogs
tags:
    - blogs
    - Java
    - Maven
    - JAR
---

## 前言

由於筆者可見的未來會用到Java來撰寫專案，所以最近開始學習如何使用Java。說到學習一個新的語言，自然是直接嘗試撰寫一個專案是最快的學習方法了。在撰寫專案的同時，也嘗試使用[Maven](https://maven.apache.org/)工具來學習如何封裝撰寫好的專案，並進行驗證和執行等等操作。在這個過程中，我了解到幾種不同的做法——Fat JAR、Thin JAR，並嘗試進行實作。接下來我將會分享這兩種做法的差異，並將專案打包成可執行的程式。

## 什麼是Fat JAR？ Thin JAR又是什麼？

所謂的**Fat JAR**（也稱**Uber-Jar**），指的就是把所有需要的功能以及類別等等物件，通通塞進一個JAR檔案裡面。由於這樣做將會導致單一JAR檔案非常的大，因而將其稱為**Fat JAR**。反之，**Thin JAR**指的就是只有將編譯過的核心物件放入JAR檔案中，其餘依賴工具（Dependencies）等等則放置在其他地方。這樣做可以最小化JAR檔案的大小，所以稱為Thin JAR。

這兩種做法各有其好處。Fat JAR由於所有的東西都集中在一個檔案，在管理以及部署上可以相對簡單；而Thin JAR則是可以達成最有效的空間利用，且在儲存上具有更大的優勢，缺點就是管理上會需要花更多的心思。至於應該選擇何者？我想這就是根據狀況來進行決定，沒有什麼絕對的答案。

## 情景與實作

在本次分享中，我們將嘗試使用Java撰寫Telegram機器人，並將撰寫的程式打包成JAR進行後續使用。我們使用Maven提供的`maven-archetype-quick`產生專案資料夾。以下是我們的資料夾結構：

```text
telegram_bot
├── dependency-reduced-pom.xml
├── pom.xml
├── src
│   ├── main
│   │   └── java
│   │       └── com
│   │           └── telegram_bot
│   │               ├── Main.java
│   │               └── Bot.java
│   └── test
│       └── java
│           └── com
│               └── telegram_bot
│                   └── AppTest.java
```

首先，我們要在`pom.xml`檔案中的`dependencies`章節中宣告我們要使用的依賴工具：

```xml
<dependencies>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.11</version>
    <scope>test</scope>
  </dependency>
  <dependency>
    <groupId>org.telegram</groupId>
    <artifactId>telegrambots-longpolling</artifactId>
    <version>8.3.0</version>
  </dependency>
  <dependency>
    <groupId>org.telegram</groupId>
    <artifactId>telegrambots-client</artifactId>
    <version>8.3.0</version>
  </dependency>
</dependencies>
```

接下來，我們在`Main.java`中定義了機器人的主要程式入口（Main Class）：

```java
package com.telegram_bot;

import org.telegram.telegrambots.longpolling.TelegramBotsLongPollingApplication;

public class Main {
    public static void main(String[] args) {
        String botToken = "<bot token>";
        try (TelegramBotsLongPollingApplication botsApplication = new TelegramBotsLongPollingApplication()) {
            botsApplication.registerBot(botToken, new Bot(botToken));
            System.out.println("Bot successfully started!");
            Thread.currentThread().join();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}

```

接下來，我們在`Bot.java`中定義繼承了`LongPollingSingleThreadUpdateConsumer`的`Bot`物件，這個物件會把用戶傳送的訊息原封不動回傳給用戶。

```java
package com.telegram_bot;

import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;
import org.telegram.telegrambots.longpolling.util.LongPollingSingleThreadUpdateConsumer;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.generics.TelegramClient;

public class Bot implements LongPollingSingleThreadUpdateConsumer {
    private final TelegramClient telegramClient;

    public Bot(String botToken) {
        telegramClient = new OkHttpTelegramClient(botToken);
    }

    @Override
    public void consume(Update update) {
        // We check if the update has a message and the message has text
        if (update.hasMessage() && update.getMessage().hasText()) {
            // Set variables
            String message_text = update.getMessage().getText();
            long chat_id = update.getMessage().getChatId();

            SendMessage message = SendMessage // Create a message object
                    .builder()
                    .chatId(chat_id)
                    .text(message_text)
                    .build();
            try {
                telegramClient.execute(message); // Sending our message object to user
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        }
    }
}
```

接下來，我們將示範如何在`pom.xml`中進行設定，來完成Fat JAR以及Thin JAR的封裝，並將這個Bot打包成可以用的檔案。

### Fat JAR

要將專案打包成Fat JAR，需要使用`maven-shade-plugin`並宣告相對應的`phase`、`goal`、以及`executions`等設定來將專案封裝成Fat JAR。首先，在`pom.xml`中的`plugins`中新增一個`plugin`：

```xml
<plugins>
  # .... other plugins
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>3.4.1</version>
  </plugin>
</plugins>
```

接下來，我們在`version`後面加入`executions`章節。`executions`章節的作用在於宣告一個執行的動作，並設定這個動作將在生命週期哪一個階段被執行，以及要做什麼。

```xml
<plugins>
  # .... other plugins
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>3.4.1</version>
    <execution>
    <phase>package</phase>
    <goals>
      <goal>shade</goal>
    </goals>
  </plugin>
</plugins>
```

上面新增的部分所對應的設定為：「在`package`階段執行`shade`的目標」。接下來我們需要使用`configuration`來設定`execution`時要做什麼。這邊我們定義了`transformer`的動作，`transformer`是為了處理資源以及Manifest時所使用的動作。在這邊我們使用了`ManifestResourceTransformer`這個實作。`ManifestResourceTransformer`會把我們自訂的Main Class寫到最終生成的`META-INF/MANIFEST.MF`之中。

```xml
<plugins>
  # .... other plugins
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>3.4.1</version>
    <executions>
      <execution>
        <phase>package</phase>
        <goals>
          <goal>shade</goal>
        </goals>
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
</plugins>
```

在完成設定後，我們只要執行`mvn clean package`，Maven就會幫我們打所有需要的東西打包成單一JAR，並放置於`target/`檔案中。我們可以使用`ls -alh`來檢視`target/`資料夾中的檔案：

```text
-rw-r--r--@  1 User  staff   8.6M  4 Jun 23:44 telegram_bot-0.1.0.jar
```

可以注意到有一個8.6M大小的JAR檔案存在。接下來我們可以使用以下指令來運作我們的程式：

```shell
java -jar target/telegram_bot-0.1.0.jar
```

執行指令後，將可以看到以下文字，代表我們的程式已經開始運作了。

```text
Bot successfully started!
```

### Thin JAR

Thin JAR的做法與Fat JAR相比，產生的檔案大小相對較小，但必須要自己處理依賴工具的導入。這邊提供我學到的兩種方法，也歡迎有經驗的讀者提供更多種做法。

1. 使用`mvn`指令手動將依賴工具複製到`target/`資料夾，並在啟動時宣告依賴工具的位置
2. 使用`AppAssembler`將所有的程式碼以及依賴工具進行搜集，並自動在`target/`資料夾中產生一份依賴工具的目錄

## 方法一

第一種方法在設定上比較簡單，只要在`pom.xml`中設定好相關的依賴工具後，先使用`mvn clean package`將自訂的程式碼打包，再使用以下指令來將依賴工具的程式碼複製到`target/`資料夾中：

```shell
mvn dependency:copy-dependencies -DoutputDirectory=target/dependency
```

接下來，在使用以下指令，在運作自己撰寫的JAR同時，宣告依賴工具的程式碼位置，來使得程式能夠正常運作：

```shell
java -cp "telegram_bot-0.1.0.jar:dependency/*" com.telegram_bot.Main
```

當指令執行後，將可以看到與Fat JAR相同，出現以下訊息：

```text
Bot successfully started!
```

這種處理方式可以不需要在設定中有太多的著墨，但是後續需要手動將依賴工具複製到對應的位置，且還要在啟動時手動宣告依賴工具的位置，個人是不太喜歡的。所以就繼續研究，並了解到可以使用方法二來讓整個Thin JAR的產生及維護更加的順暢且容易管理。

### 方法二

在Thin JAR的打包上，我們可以透過`pom.xml`中的`maven-jar-plugin`所提供的功能，設定依賴工具將被放置的位置，同時設定主要入口的Class名稱。這樣一來，我們也可以直接以近乎Fat JAR的方式來運作程式，但在依賴工具管理和儲存上有更大的優勢。

要達成這個目標，首先我們要對`maven-jar-plugin`進行設定：

```xml
<plugins>
  # .... other plugins
  <plugin>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.2.2</version>
    <configuration>
      <archive>
        <manifest>
          <addClasspath>true</addClasspath>
          <classpathPrefix>lib/</classpathPrefix>
          <mainClass>com.telegram_bot.Main</mainClass>
        </manifest>
      </archive>
    </configuration>
  </plugin>
</plugins>
```

在上方的設定中，我們宣告要將`Class Path`納入產生的`Manifest`中，並宣告了`Class Path`的存放資料夾；此外，我們也透過`mainClass`設定了程式的主要入口。這其實等同於把`java -cp`指令中的參數，放入了`pom.xml`之中。接下來，我們就可以執行以下的指令，來將程式進行打包，並將依賴工具放到我們指定的位置：

```shell
mvn clean package
mvn dependency:copy-dependencies -DoutputDirectory=target/lib
```

完成後，我們就可以使用與Fat JAR相同的指令來啟動程式：

```shell
java -jar target/telegram_bot-0.1.0.jar
```

這樣一來，我們就不需要為了Fat JAR以及Thin JAR分別使用不同的指令，在管理上有了一定程度的改善，但可惜的是仍沒辦法讓依賴工具的處理方面能夠被自動的處理。

## 小節

這次學習Java以及Maven的過程，與過去使用其他語言的過程有許多的不同，對我來說是非常新奇的體驗。Maven提供了很多很有趣，也很強大的功能，不過在學習上所需要花費的心力也是相對更多的。希望這篇文章可以幫助到其他想接觸Java的朋友。

---

如果覺得我的文章對你有幫助，歡迎請我喝一杯咖啡～


<a href="https://www.buymeacoffee.com/ds_cafe_and_tips"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=ds_cafe_and_tips&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>