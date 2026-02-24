<script setup lang="ts">
import { defineClientComponent } from 'vitepress';

const HeroSection = defineClientComponent(
  () => import('./components/HeroSection.vue')
);
const SupportSection = defineClientComponent(
  () => import('./components/SupportSection.vue')
);
const FeaturesSection = defineClientComponent(
  () => import('./components/FeaturesSection/index.vue')
);
const ProductDisplayArea = defineClientComponent(
  () => import('./components/ProductDisplayArea.vue')
);
const ReviewsSection = defineClientComponent(
  () => import('./components/ReviewsSection.vue')
);
const Contributors = defineClientComponent(
  () => import('./components/Contributors.vue')
);
const Footer = defineClientComponent(() => import('./components/Footer.vue'));
</script>

<template>
  <div class="page-container">
    <!-- 首屏英雄区 -->
    <HeroSection />

    <!-- 赞助与支持区域 -->
    <div class="mt-[-100px]">
      <SupportSection />
    </div>

    <!-- 特性区域 -->
    <div class="mt-[500px]">
      <FeaturesSection />
    </div>

    <!-- 产品展示区域 -->
    <ProductDisplayArea />

    <!-- 社区评价区域 -->
    <ReviewsSection />

    <!-- 贡献者 -->
    <Contributors />

    <!-- 底部区域 -->
    <Footer />
  </div>
</template>

<style scoped></style>
