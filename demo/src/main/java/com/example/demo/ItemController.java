package com.example.demo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;
    
    

    @PostMapping("/upload")
    public ResponseEntity<Item> uploadItem(
            @RequestParam("product_name") String productName,
            @RequestParam("category") String category,
            @RequestParam("price") Double price,
            @RequestParam("product_uploader") String productUploader,
            @RequestParam("image") MultipartFile image) {

        // 이미지 파일 저장 경로 설정
        String uploadDir = "C:\\Solo\\demo\\src\\main\\resources\\static\\images\\";
        String imageName = System.currentTimeMillis() + "_" + image.getOriginalFilename(); // 고유한 파일 이름 생성
        String imagePath = uploadDir + imageName;
        
        // 이미지 파일 저장
        try {
            image.transferTo(new File(imagePath));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        // Item 객체 생성 및 저장
        Item item = new Item();
        item.setProductName(productName);
        item.setCategory(category);
        item.setPrice(price);
        item.setProductUploader(productUploader);
        item.setImages("/images/" + imageName); // 상대 경로로 저장

        Item savedItem = itemService.saveItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }

    // 파일 크기 초과 예외 처리
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("파일 크기가 너무 큽니다. 최대 10MB 이하로 업로드해 주세요.");
    }
    
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Item>> getItemsByCategory(@PathVariable String category) {
        List<Item> items = itemService.getItemsByCategory(category);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Optional<Item> item = itemService.findById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }



}
