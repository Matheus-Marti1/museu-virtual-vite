<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  onBeforeUpdate,
} from "vue";
import { timelineItems } from "../data/timeline-data.js";

const isModalOpen = ref(false);
const selectedItem = ref(null);
const modalState = ref("hidden");
const activeYear = ref(null);
const yearNavEl = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const timelineItemRefs = ref([]);

onBeforeUpdate(() => {
  timelineItemRefs.value = [];
});

const openModal = (event, item) => {
  if (event.target.closest("a")) {
    return;
  }
  selectedItem.value = item;
  isModalOpen.value = true;
  modalState.value = "entering";
  setTimeout(() => {
    modalState.value = "visible";
  }, 10);
};

const closeModal = () => {
  modalState.value = "leaving";
  setTimeout(() => {
    isModalOpen.value = false;
    selectedItem.value = null;
    modalState.value = "hidden";
  }, 200);
};

const getModalSource = (item) => {
  if (!item) return "";
  return item.sourceModal || item.source || "";
};

const getCardSource = (item) => {
  return item.sourceCard || item.source || "";
};

const formattedDescription = computed(() => {
  if (!selectedItem.value) return "";
  return selectedItem.value.longDescription
    .split("\n")
    .filter((p) => p.trim() !== "")
    .map((p) => `<p class="mb-4">${p.trim()}</p>`)
    .join("");
});

const groupedTimelineItems = computed(() => {
  const grouped = {};

  timelineItems.forEach((item) => {
    if (!grouped[item.year]) {
      grouped[item.year] = {
        year: item.year,
        items: [],
      };
    }
    grouped[item.year].items.push(item);
  });

  return Object.values(grouped).sort(
    (a, b) => parseInt(a.year) - parseInt(b.year)
  );
});

const years = computed(() => {
  const yearSet = new Set(timelineItems.map((item) => item.year));
  return Array.from(yearSet).sort((a, b) => parseInt(a) - parseInt(b));
});

const scrollToYear = (year) => {
  const el = document.getElementById(`year-${year}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    centerActiveYear("smooth");
  }
};

const scrollNav = (direction) => {
  if (yearNavEl.value) {
    const amount = yearNavEl.value.clientWidth * 0.8 * direction;
    yearNavEl.value.scrollBy({ left: amount, behavior: "smooth" });
  }
};

const updateScrollShadows = () => {
  const el = yearNavEl.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 2;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
};

const centerActiveYear = (behavior = "auto") => {
  const container = yearNavEl.value;
  if (!container || !activeYear.value) return;

  const activeButton = container.querySelector(
    `[data-year="${activeYear.value}"]`
  );
  if (!activeButton) return;

  const offset =
    activeButton.offsetLeft -
    (container.clientWidth / 2 - activeButton.clientWidth / 2);

  container.scrollTo({ left: Math.max(0, offset), behavior });
};

onMounted(() => {
  yearNavEl.value?.addEventListener("scroll", updateScrollShadows, {
    passive: true,
  });
  window.addEventListener("resize", updateScrollShadows);
  updateScrollShadows();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeYear.value = entry.target.id.replace("year-", "");
        }
      });
    },
    { rootMargin: "-60% 0px -35% 0px" }
  );

  document
    .querySelectorAll(".year-anchor")
    .forEach((el) => observer.observe(el));

  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("timeline-visible");
          entry.target.classList.remove("timeline-hidden");
          animationObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  timelineItemRefs.value.forEach((item) => {
    if (item) {
      animationObserver.observe(item);
    }
  });
});

onUnmounted(() => {
  yearNavEl.value?.removeEventListener("scroll", updateScrollShadows);
  window.removeEventListener("resize", updateScrollShadows);
});

watch(activeYear, () => {
  centerActiveYear("smooth");
});
</script>

<template>
  <div>
    <h1 class="text-4xl md:text-5xl font-bold text-center mb-12">
      Linha do Tempo
    </h1>

    <nav aria-label="Navegação por anos" class="mb-10 year-nav-sticky">
      <div
        ref="yearNavWrapperEl"
        class="year-nav-wrapper relative border border-white/10 bg-white/5 backdrop-blur-md rounded-xl">
        <button
          class="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-1 z-10 items-center justify-center w-9 h-9 rounded-full backdrop-blur-md border border-white/25 bg-white/10 text-white transition hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer"
          type="button"
          aria-label="Rolar anos para a esquerda"
          v-show="canScrollLeft"
          @click="scrollNav(-1)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref="yearNavEl"
          class="year-nav overflow-x-auto scroll-smooth cursor-grab flex gap-3 md:gap-4 items-center py-2 pl-10 pr-10 md:pl-12 md:pr-12"
          :class="{
            'pl-12 md:pl-16': !canScrollLeft,
            'pr-12 md:pr-16': !canScrollRight,
          }">
          <button
            v-for="year in years"
            :key="'nav-' + year"
            type="button"
            @click="scrollToYear(year)"
            class="whitespace-nowrap cursor-pointer border border-white/25 bg-white/10 text-white rounded-full px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base shadow-sm transition transform hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/40"
            :data-year="year"
            :class="{
              'bg-white/30 border-white/60 text-gray-900 font-bold':
                activeYear === year,
            }">
            {{ year }}
          </button>
        </div>

        <button
          class="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-1 z-10 items-center justify-center w-9 h-9 rounded-full backdrop-blur-md border border-white/25 bg-white/10 text-white transition hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer"
          type="button"
          aria-label="Rolar anos para a direita"
          v-show="canScrollRight"
          @click="scrollNav(1)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div
          class="absolute inset-y-0 left-0 w-12 pointer-events-none transition-opacity bg-gradient-to-r from-black/70 to-transparent"
          :class="{ hidden: !canScrollLeft }"></div>
        <div
          class="absolute inset-y-0 right-0 w-12 pointer-events-none transition-opacity bg-gradient-to-l from-black/70 to-transparent"
          :class="{ hidden: !canScrollRight }"></div>
      </div>
    </nav>

    <section class="mb-12">
      <p
        class="timeline-disclaimer mx-auto max-w-3xl text-center text-sm text-gray-200 opacity-90 italic leading-relaxed">
        Os textos exibidos foram adaptados de coleções públicas como
        <a
          href="https://www.computinghistory.org.uk/"
          target="_blank"
          rel="noopener noreferrer"
          >Centre for Computing History</a
        >
        e o
        <a
          href="https://computerhistory.org/"
          target="_blank"
          rel="noopener noreferrer"
          >Computer History Museum</a
        >.
      </p>
    </section>

    <div class="relative mx-auto max-w-5xl px-4 sm:px-6">
      <div
        class="absolute left-1/2 top-0 -ml-px h-full w-0.5 bg-white/20"
        aria-hidden="true"></div>

      <div
        v-for="(yearGroup, yearIndex) in groupedTimelineItems"
        :key="yearGroup.year"
        class="relative year-anchor"
        :id="'year-' + yearGroup.year">
        <div
          class="z-20 flex items-center"
          :class="[yearIndex % 2 === 0 ? 'justify-start' : 'md:justify-end']">
          <h2
            class="w-20 rounded-full border border-white/30 bg-gray-900/80 px-4 py-2 text-center text-sm font-semibold text-white backdrop-blur-sm">
            {{ yearGroup.year }}
          </h2>
        </div>

        <div class="mt-6 md:mt-8">
          <div
            v-for="(item, itemIndex) in yearGroup.items"
            :key="item.title"
            :ref="
              (el) => {
                if (el) timelineItemRefs.push(el);
              }
            "
            class="relative mb-12 flex items-start timeline-item timeline-hidden"
            :class="[
              yearIndex % 2 === 0
                ? 'md:flex-row timeline-item-left'
                : 'md:flex-row-reverse timeline-item-right',
            ]">
            <button
              @click="openModal($event, item)"
              class="modal-trigger group w-full cursor-pointer rounded-xl border border-white/10 bg-black/20 p-4 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-black/30 hover:shadow-2xl md:w-[calc(50%-2.5rem)]">
              <img
                :src="item.imageCard"
                :alt="'Imagem de ' + item.title"
                class="mb-3 w-full rounded-lg object-cover timeline-image" />
              <p
                class="mb-3 text-right text-xs italic text-gray-400"
                v-html="'Fonte: ' + getCardSource(item)"></p>
              <h3 class="mb-1 text-lg font-bold text-white">
                {{ item.title }}
              </h3>
              <p class="text-sm text-gray-200">
                {{ item.shortDescription }}
              </p>
            </button>

            <div
              class="absolute top-8 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 ring-4 ring-gray-900/80"
              :class="[
                yearIndex % 2 === 0
                  ? 'right-full mr-4 md:left-1/2 md:-ml-2.5 md:mr-0'
                  : 'right-full mr-4 md:right-auto md:left-1/2 md:-ml-2.5',
              ]">
              <div class="h-2 w-2 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      @click.self="closeModal"
      class="modal-overlay"
      :class="{
        'modal-entering': modalState === 'entering',
        'modal-visible': modalState === 'visible',
        'modal-leaving': modalState === 'leaving',
      }">
      <div
        v-if="selectedItem"
        class="modal-content relative mx-4 my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/20 bg-gray-900/80 p-6 text-gray-300 shadow-2xl backdrop-blur-lg sm:p-8">
        <button
          @click="closeModal"
          class="absolute right-4 top-4 z-20 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Fechar modal">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div class="pr-12 mb-2">
          <h2 class="text-2xl font-bold text-white sm:text-3xl">
            {{ selectedItem.title }}
            <span class="text-xl font-semibold text-gray-400"
              >({{ selectedItem.year }})</span
            >
          </h2>
        </div>
        <img
          :src="selectedItem.imageModal"
          :alt="'Imagem detalhada de ' + selectedItem.title"
          class="modal-image my-4 rounded-lg" />
        <p
          class="mb-4 text-right text-xs italic text-gray-400"
          v-html="'Fonte: ' + getModalSource(selectedItem)"></p>
        <div
          class="prose prose-invert max-w-none text-gray-300"
          v-html="formattedDescription"></div>
      </div>
    </div>
  </div>
</template>
