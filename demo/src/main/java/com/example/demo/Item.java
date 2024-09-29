package com.example.demo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "product_uploader", nullable = false)
    private String productUploader;

    @Column(name = "images", nullable = false)
    private String images;

    @Column(name = "save_time", nullable = false)
    private LocalDateTime saveTime;
}
