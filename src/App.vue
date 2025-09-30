<script setup>
import Header from "./components/Header.vue";
import { ref, onMounted, onUnmounted } from "vue";

const showBackToTop = ref(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
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

    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold p-4 rounded-full shadow-lg border border-white/20 transition-all duration-300 hover:scale-110 z-50 cursor-pointer">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    </button>
  </div>
</template>
