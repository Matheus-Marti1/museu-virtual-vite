<script setup>
import Header from "./components/Header.vue";
</script>

<template>
  <div class="fixed inset-0 bg-main-background -z-10"></div>
  <div class="relative min-h-screen flex flex-col">
    <Header />
    <main class="container mx-auto px-6 py-12 flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>
