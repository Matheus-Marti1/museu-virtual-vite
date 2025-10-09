<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  if (import.meta.env.PROD) {
    displayToast("Página administrativa não disponível em produção", "error");
    setTimeout(() => router.push("/"), 2000);
  }
});

const newItem = ref({
  year: "",
  title: "",
  shortDescription: "",
  longDescription: "",
  category: [],
  imageCard: "",
  imageModal: "",
  sourceCard: "",
  sourceModal: "",
});

const previewItem = ref(null);
const showPreview = ref(false);
const showModalPreview = ref(false);

const categories = [
  "Computadores",
  "Hardware",
  "Software",
  "Empresas",
  "Redes",
  "Inteligência Artificial",
  "Smartphones",
];

const categoryColors = {
  Computadores: "bg-blue-500/80",
  Hardware: "bg-purple-500/80",
  Software: "bg-green-500/80",
  Empresas: "bg-orange-500/80",
  Redes: "bg-cyan-500/80",
  "Inteligência Artificial": "bg-pink-500/80",
  Smartphones: "bg-yellow-500/80",
};

const getCategoryColor = (category) => {
  return categoryColors[category] || "bg-gray-500/80";
};

const toggleCategory = (category) => {
  const index = newItem.value.category.indexOf(category);
  if (index > -1) {
    newItem.value.category.splice(index, 1);
  } else {
    newItem.value.category.push(category);
  }
};

const isCategorySelected = (category) => {
  return newItem.value.category.includes(category);
};

const toastMessage = ref("");
const toastType = ref("info");
const showToast = ref(false);

const displayToast = (message, type = "info") => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const generatePreview = () => {
  if (
    !newItem.value.year ||
    !newItem.value.title ||
    !newItem.value.shortDescription ||
    !newItem.value.longDescription ||
    !newItem.value.imageCard ||
    !newItem.value.sourceCard ||
    newItem.value.category.length === 0
  ) {
    displayToast("Preencha todos os campos obrigatórios (*)", "error");
    return;
  }

  previewItem.value = {
    ...newItem.value,
    imageModal: newItem.value.imageModal || newItem.value.imageCard,
    sourceModal: newItem.value.sourceModal || newItem.value.sourceCard,
  };
  showPreview.value = true;
  displayToast("Preview gerado com sucesso!", "success");
};

const generateCode = () => {
  if (!previewItem.value) {
    displayToast("Gere o preview primeiro", "error");
    return;
  }

  const escapedLongDesc = previewItem.value.longDescription
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");

  const escapedSourceCard = previewItem.value.sourceCard
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");

  const escapedSourceModal = previewItem.value.sourceModal
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");

  const categoryValue = previewItem.value.category.length === 1
    ? `"${previewItem.value.category[0]}"`
    : `[${previewItem.value.category.map(cat => `"${cat}"`).join(", ")}]`;

  const code = `  {
    year: "${previewItem.value.year}",
    title: "${previewItem.value.title}",
    shortDescription: "${previewItem.value.shortDescription}",
    imageCard: "${previewItem.value.imageCard}",
    imageModal: "${previewItem.value.imageModal}",
    sourceCard: \`${escapedSourceCard}\`,
    sourceModal: \`${escapedSourceModal}\`,
    category: ${categoryValue},
    longDescription: \`${escapedLongDesc}\`,
  },`;

  navigator.clipboard.writeText(code);
  displayToast(
    "✅ Código copiado! Cole no arquivo timeline-data.js",
    "success"
  );
};

const resetForm = () => {
  newItem.value = {
    year: "",
    title: "",
    shortDescription: "",
    longDescription: "",
    category: [],
    imageCard: "",
    imageModal: "",
    sourceCard: "",
    sourceModal: "",
  };
  previewItem.value = null;
  showPreview.value = false;
  showModalPreview.value = false;
  displayToast("Formulário limpo", "info");
};

const openModalPreview = () => {
  showModalPreview.value = true;
};

const closeModalPreview = () => {
  showModalPreview.value = false;
};

const formattedDescription = (text) => {
  if (!text) return "";
  return text.split("\n\n").filter((p) => p.trim());
};
</script>

<template>
  <div class="min-h-screen pb-16">
    <Transition name="toast">
      <div
        v-if="showToast"
        class="fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border max-w-sm"
        :class="{
          'bg-blue-500/90 border-blue-400/50 text-white': toastType === 'info',
          'bg-green-500/90 border-green-400/50 text-white':
            toastType === 'success',
          'bg-red-500/90 border-red-400/50 text-white': toastType === 'error',
        }">
        <svg
          v-if="toastType === 'info'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg
          v-if="toastType === 'success'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg
          v-if="toastType === 'error'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium">{{ toastMessage }}</span>
      </div>
    </Transition>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">🔧 Painel Administrativo</h1>
        <p class="text-gray-400">Adicionar novo item à Timeline</p>
        <div
          class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span
            ><strong>Ambiente de desenvolvimento</strong> - Disponível apenas em
            localhost</span
          >
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <div
          class="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-8">
          <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Formulário
          </h2>

          <form @submit.prevent="generatePreview" class="space-y-6">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Ano *</label>
                <input
                  v-model="newItem.year"
                  type="text"
                  required
                  placeholder="Ex: 1937"
                  class="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2"
                  >Título *</label
                >
                <input
                  v-model="newItem.title"
                  type="text"
                  required
                  placeholder="Ex: Computador Atanasoff-Berry"
                  class="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-3"
                >Categorias * (selecione uma ou mais)</label
              >
              <div class="grid sm:grid-cols-2 gap-3">
                <label
                  v-for="cat in categories"
                  :key="cat"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all"
                  :class="
                    isCategorySelected(cat)
                      ? 'bg-white/10 border-white/40 hover:bg-white/15'
                      : 'bg-black/30 border-white/20 hover:bg-black/40 hover:border-white/30'
                  ">
                  <input
                    type="checkbox"
                    :checked="isCategorySelected(cat)"
                    @change="toggleCategory(cat)"
                    class="w-4 h-4 rounded border-white/30 bg-black/50 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer" />
                  <div class="flex items-center gap-2 flex-1">
                    <span
                      class="w-3 h-3 rounded-full"
                      :class="getCategoryColor(cat)"></span>
                    <span class="text-sm font-medium">{{ cat }}</span>
                  </div>
                </label>
              </div>
              <p class="mt-2 text-xs text-gray-400">
                💡 Selecione categorias que melhor descrevem o item
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2"
                >Descrição Curta *</label
              >
              <textarea
                v-model="newItem.shortDescription"
                required
                rows="2"
                placeholder="Resumo de uma linha que aparece no card"
                class="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2"
                >Descrição Completa *</label
              >
              <textarea
                v-model="newItem.longDescription"
                required
                rows="6"
                placeholder="Texto completo do modal. Use quebras de linha para separar parágrafos."
                class="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors" />
              <p class="mt-1 text-xs text-gray-400">
                💡 Use Enter para separar parágrafos
              </p>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2"
                  >Imagem Card (URL) *</label
                >
                <input
                  v-model="newItem.imageCard"
                  type="text"
                  required
                  placeholder="/images/timeline/arquivo.webp"
                  class="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors" />
                <p class="mt-1 text-xs text-gray-400">
                  📁 Caminho relativo à pasta public/
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2"
                  >Imagem Modal (URL)</label
                >
                <input
                  v-model="newItem.imageModal"
                  type="text"
                  :placeholder="
                    newItem.imageCard || 'Deixe vazio para usar a mesma do card'
                  "
                  class="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors" />
                <p class="mt-1 text-xs text-gray-400">
                  💡 Opcional - usa imageCard se vazio
                </p>
              </div>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2"
                  >Fonte Card (HTML) *</label
                >
                <textarea
                  v-model="newItem.sourceCard"
                  required
                  rows="3"
                  placeholder='<a href="..." target="_blank">Texto do link</a>, licença'
                  class="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors" />
                <p class="mt-1 text-xs text-gray-400">
                  💡 Fonte que aparece no card
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2"
                  >Fonte Modal (HTML)</label
                >
                <textarea
                  v-model="newItem.sourceModal"
                  rows="3"
                  :placeholder="
                    newItem.sourceCard ||
                    'Deixe vazio para usar a mesma do card'
                  "
                  class="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors" />
                <p class="mt-1 text-xs text-gray-400">
                  💡 Opcional - usa sourceCard se vazio
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-blue-500/80 hover:bg-blue-500 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Gerar Preview
              </button>
              <button
                type="button"
                @click="resetForm"
                class="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Limpar
              </button>
            </div>
          </form>
        </div>

        <div
          class="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-8">
          <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </h2>

          <div
            v-if="!showPreview"
            class="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg
              class="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-center">
              Preencha o formulário e clique em<br />"Gerar Preview" para
              visualizar
            </p>
          </div>

          <div v-else class="space-y-6">
            <div
              class="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
              <p class="text-xs text-gray-400 mb-3">📱 Como aparece no card:</p>
              <img
                v-if="previewItem.imageCard"
                :src="previewItem.imageCard"
                :alt="previewItem.title"
                class="w-full rounded-lg object-cover mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                style="max-height: 200px"
                @click="openModalPreview"
                @error="
                  (e) =>
                    (e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect width=\'400\' height=\'300\' fill=\'%23333\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23999\' font-family=\'sans-serif\' font-size=\'16\'%3EImagem não encontrada%3C/text%3E%3C/svg%3E')
                " />

              <p
                class="mb-3 text-right text-xs italic text-gray-400"
                v-html="previewItem.sourceCard"></p>

              <div class="mb-3 flex items-center justify-between flex-wrap gap-2">
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="cat in previewItem.category"
                    :key="cat"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                    :class="getCategoryColor(cat)">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                        clip-rule="evenodd" />
                    </svg>
                    {{ cat }}
                  </span>
                </div>
                <span class="text-xs font-medium text-gray-400">{{
                  previewItem.year
                }}</span>
              </div>

              <h3 class="mb-1 text-lg font-bold text-white">
                {{ previewItem.title }}
              </h3>
              <p class="text-sm text-gray-200">
                {{ previewItem.shortDescription }}
              </p>

              <div
                class="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-blue-300">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span>Clique na imagem para ver o modal</span>
              </div>
            </div>

            <button
              @click="generateCode"
              class="w-full px-6 py-3 bg-green-500/80 hover:bg-green-500 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar Código
            </button>

            <div
              class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p class="text-sm text-blue-200 font-medium mb-2">
                📋 Próximos passos:
              </p>
              <ol
                class="text-sm text-blue-200/80 space-y-1 list-decimal list-inside">
                <li>Código copiado para o clipboard</li>
                <li>
                  Abra
                  <code class="bg-black/50 px-2 py-0.5 rounded"
                    >src/data/timeline-data.js</code
                  >
                </li>
                <li>
                  Cole o código dentro do array
                  <code class="bg-black/50 px-2 py-0.5 rounded"
                    >timelineItems</code
                  >
                </li>
                <li>
                  Execute
                  <code class="bg-black/50 px-2 py-0.5 rounded"
                    >npm run generate:images</code
                  >
                </li>
                <li>Faça commit e push para deploy</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="modal">
      <div
        v-if="showModalPreview"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click="closeModalPreview">
        <div
          class="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop>
          <div
            class="sticky top-0 bg-black/50 backdrop-blur-md border-b border-white/20 p-4 flex items-center justify-between">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                v-for="cat in previewItem.category"
                :key="cat"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                :class="getCategoryColor(cat)">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd" />
                </svg>
                {{ cat }}
              </span>
              <span class="text-sm font-medium text-gray-400">{{
                previewItem.year
              }}</span>
            </div>
            <button
              @click="closeModalPreview"
              class="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <h2 class="text-2xl font-bold mb-4">{{ previewItem.title }}</h2>

            <img
              v-if="previewItem.imageModal"
              :src="previewItem.imageModal"
              :alt="previewItem.title"
              class="w-full rounded-lg object-cover mb-2"
              @error="
                (e) =>
                  (e.target.src =
                    'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'400\'%3E%3Crect width=\'600\' height=\'400\' fill=\'%23333\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23999\' font-family=\'sans-serif\' font-size=\'18\'%3EImagem não encontrada%3C/text%3E%3C/svg%3E')
              " />

            <p
              class="mb-4 text-right text-xs italic text-gray-400"
              v-html="previewItem.sourceModal"></p>

            <div class="prose prose-invert max-w-none">
              <p
                v-for="(paragraph, index) in formattedDescription(
                  previewItem.longDescription
                )"
                :key="index"
                class="mb-4 text-gray-200 text-justify leading-relaxed">
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
