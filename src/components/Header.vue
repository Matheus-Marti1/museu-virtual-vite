<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const isComponentesDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isMobileComponentesOpen = ref(false);
const route = useRoute();
const componentesMenuRef = ref(null);
const isScrolled = ref(false);

const handleClickOutside = (event) => {
  if (
    isComponentesDropdownOpen.value &&
    !componentesMenuRef.value.contains(event.target)
  ) {
    isComponentesDropdownOpen.value = false;
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  window.removeEventListener("scroll", handleScroll);
});

const isComponentesActive = computed(() => {
  return route.path.startsWith('/componentes/');
});

const closeComponentesDropdown = () => {
  isComponentesDropdownOpen.value = false;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  isMobileComponentesOpen.value = false;
};
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 w-full py-4 px-8 md:px-14 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-black/50 backdrop-blur-lg border-b border-white/20 shadow-xl' : 'bg-transparent'">
    <nav class="flex justify-between items-center">
      <div class="flex items-center">
        <router-link to="/"><img src="/images/logo_fatec.png" alt="Logo da Fatec" class="h-14 w-auto" /></router-link>
      </div>

      <ul class="hidden md:flex items-center space-x-10 text-xl">
        <li>
          <router-link to="/timeline" class="nav-link transition-all duration-300 hover:text-gray-300"
            active-class="font-bold text-white border-b-2 border-white">Linha do Tempo</router-link>
        </li>
        <li class="relative" ref="componentesMenuRef">
          <button @click="isComponentesDropdownOpen = !isComponentesDropdownOpen" id="componentesBtn"
            :class="{ 'font-bold text-white border-b-2 border-white': isComponentesActive }"
            class="nav-link hover:text-gray-300 transition-colors flex items-center cursor-pointer">
            Componentes
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
          <transition name="dropdown-fade">
            <div v-if="isComponentesDropdownOpen" id="componentesDropdown"
              class="absolute top-full mt-3 right-0 bg-black/50 backdrop-blur-md border-2 border-white rounded-lg w-64 z-30">
              <ul class="text-lg text-center">
                <li>
                  <router-link to="/componentes/placa-mae" @click="closeComponentesDropdown" active-class="bg-white/10"
                    class="nav-component-link block py-2 px-4 hover:bg-white/10 rounded-t-lg transition-all duration-300 ">Placa-Mãe</router-link>
                </li>
                <li>
                  <router-link to="/componentes/processador" @click="closeComponentesDropdown"
                    active-class="bg-white/10"
                    class="nav-component-link block py-2 px-4 hover:bg-white/10 transition-all duration-300">Processador</router-link>
                </li>
                <li>
                  <router-link to="/componentes/ram" @click="closeComponentesDropdown" active-class="bg-white/10"
                    class="nav-component-link block py-2 px-4 hover:bg-white/10 transition-all duration-300">RAM</router-link>
                </li>
                <li>
                  <router-link to="/componentes/hd-ssd" @click="closeComponentesDropdown" active-class="bg-white/10"
                    class="nav-component-link block py-2 px-4 hover:bg-white/10 transition-all duration-300">HDD/SSD</router-link>
                </li>
                <li>
                  <router-link to="/componentes/fonte" @click="closeComponentesDropdown" active-class="bg-white/10"
                    class="nav-component-link block py-2 px-4 hover:bg-white/10 transition-all duration-300">Fonte</router-link>
                </li>
                <li>
                  <router-link to="/componentes/gabinete" @click="closeComponentesDropdown" active-class="bg-white/10"
                    class="nav-component-link block py-2 px-4 hover:bg-white/10 transition-all duration-300">Gabinete</router-link>
                </li>
                <li>
                  <router-link to="/componentes/midia" @click="closeComponentesDropdown" active-class="bg-white/10"
                    class="nav-component-link block py-2 px-4 hover:bg-white/10 transition-all duration-300">Mídias</router-link>
                </li>
                <li>
                  <router-link to="/componentes/perifericos" @click="closeComponentesDropdown"
                    active-class="bg-white/10"
                    class="nav-component-link block py-2 px-4 hover:bg-white/10 rounded-b-lg transition-all duration-300">Periféricos</router-link>
                </li>
              </ul>
            </div>
          </transition>
        </li>
        <li>
          <router-link to="/membros" class="nav-link transition-all duration-300 hover:text-gray-300"
            active-class="font-bold text-white border-b-2 border-white">Membros</router-link>
        </li>
      </ul>

      <div class="md:hidden">
        <button @click="isMobileMenuOpen = true" id="mobileMenuBtn"
          class="text-white focus:outline-none z-40 transition-all duration-300">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </nav>
  </header>

  <div :class="{ 'opacity-0 scale-95 pointer-events-none': !isMobileMenuOpen }" id="mobileMenu"
    class="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex flex-col items-center justify-center transition-all duration-300 transform">
    <button @click="isMobileMenuOpen = false" id="closeMobileMenuBtn"
      class="absolute top-6 right-8 text-white focus:outline-none transition-all duration-300 z-[70]">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <ul class="text-2xl text-center space-y-6">
      <li>
        <router-link to="/timeline" @click="closeMobileMenu"
          class="nav-link transition-all duration-300 hover:text-gray-300"
          active-class="font-bold text-white border-b-2 border-white">Linha do Tempo</router-link>
      </li>
      <li>
        <button @click="isMobileComponentesOpen = true" id="mobileComponentesBtn"
          :class="{ 'font-bold text-white border-b-2 border-white': isComponentesActive }"
          class="nav-link transition-all duration-300 hover:text-gray-300 w-full text-center flex items-center justify-center">
          Componentes
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2 transition-transform duration-300"
            id="mobileComponentesIcon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </li>
      <li>
        <router-link to="/membros" @click="closeMobileMenu"
          class="nav-link transition-all duration-300 hover:text-gray-300"
          active-class="font-bold text-white border-b-2 border-white">Membros</router-link>
      </li>
    </ul>
  </div>

  <div :class="{
    'opacity-0 translate-x-full pointer-events-none':
      !isMobileComponentesOpen,
  }" id="mobileComponentesSubmenu"
    class="md:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-[70] transition-all duration-300 transform">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-6 border-b border-white/20">
        <h2 class="text-2xl font-bold text-white">Componentes</h2>
        <button @click="isMobileComponentesOpen = false" id="closeMobileComponentesBtn"
          class="text-white focus:outline-none transition-all duration-300 hover:text-gray-300 z-[80]">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="flex-1 p-6 overflow-y-auto">
        <div class="grid grid-cols-2 gap-4">
          <router-link to="/componentes/placa-mae" @click="closeMobileMenu"
            active-class="bg-white/30 ring-2 ring-white/50"
            class="nav-component-link group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div class="mb-3">
              <svg class="w-12 h-12 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div class="text-lg font-medium">Placa-Mãe</div>
          </router-link>

          <router-link to="/componentes/processador" @click="closeMobileMenu"
            active-class="bg-white/30 ring-2 ring-white/50"
            class="nav-component-link group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div class="mb-3">
              <svg class="w-12 h-12 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 3v18m6-18v18M3 9h18M3 15h18M7 7h10v10H7V7z" />
                <circle cx="12" cy="12" r="2" stroke-width="1.5" />
              </svg>
            </div>
            <div class="text-lg font-medium">Processador</div>
          </router-link>

          <router-link to="/componentes/ram" @click="closeMobileMenu" active-class="bg-white/30 ring-2 ring-white/50"
            class="nav-component-link group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div class="mb-3">
              <svg class="w-12 h-12 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 6h16v12H4V6zM2 6v12M22 6v12M6 4v2M10 4v2M14 4v2M18 4v2M6 18v2M10 18v2M14 18v2M18 18v2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h8M8 14h8" />
              </svg>
            </div>
            <div class="text-lg font-medium">RAM</div>
          </router-link>

          <router-link to="/componentes/hd-ssd" @click="closeMobileMenu" active-class="bg-white/30 ring-2 ring-white/50"
            class="nav-component-link group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div class="mb-3">
              <svg class="w-12 h-12 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <circle cx="6" cy="8" r="1" stroke-width="1.5" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 8h8M6 12h12M6 16h8" />
              </svg>
            </div>
            <div class="text-lg font-medium">HDD/SSD</div>
          </router-link>

          <router-link to="/componentes/fonte" @click="closeMobileMenu" active-class="bg-white/30 ring-2 ring-white/50"
            class="nav-component-link group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div class="mb-3">
              <svg class="w-12 h-12 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 20h12M8 20v2M16 20v2" />
              </svg>
            </div>
            <div class="text-lg font-medium">Fonte</div>
          </router-link>

          <router-link to="/componentes/gabinete" @click="closeMobileMenu"
            active-class="bg-white/30 ring-2 ring-white/50"
            class="nav-component-link group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div class="mb-3">
              <svg class="w-12 h-12 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4h16v16H4V4z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M6 8h12M6 12h4M14 12h4M6 16h2M12 16h6" />
                <circle cx="18" cy="6" r="1" stroke-width="1.5" />
              </svg>
            </div>
            <div class="text-lg font-medium">Gabinete</div>
          </router-link>

          <router-link to="/componentes/midia" @click="closeMobileMenu" active-class="bg-white/30 ring-2 ring-white/50"
            class="nav-component-link group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div class="mb-3">
              <svg class="w-12 h-12 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="1.5" />
                <circle cx="12" cy="12" r="3" stroke-width="1.5" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 2v2M12 20v2M2 12h2M20 12h2" />
              </svg>
            </div>
            <div class="text-lg font-medium">Mídias</div>
          </router-link>

          <router-link to="/componentes/perifericos" @click="closeMobileMenu"
            active-class="bg-white/30 ring-2 ring-white/50"
            class="nav-component-link group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div class="mb-3">
              <svg class="w-12 h-12 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 6h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 6l8-2 8 2M8 10v2M12 10v2M16 10v2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 18h4" />
              </svg>
            </div>
            <div class="text-lg font-medium">Periféricos</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
