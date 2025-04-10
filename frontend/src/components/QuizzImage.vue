<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { api } from '../http-api';
import type { ImageType } from '../image';
import Image from './Image.vue';

const imageList = ref<ImageType[]>([]);
const randomImageId = ref<number | null>(null);
const similarImages = ref<ImageType[]>([]);

// image floue + métadonnées
const imageFlou = ref<{ blob: Blob; meta: ImageType } | null>(null);
const flouUrl = ref<string | null>(null);

// fetch la liste des images
const fetchImageList = async () => {
  try {
    imageList.value = await api.getImageList();
    if (imageList.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * imageList.value.length);
      randomImageId.value = imageList.value[randomIndex].id;
      if (randomImageId.value === 0) {
        randomImageId.value = 1;
      }
    }
  } catch (e) {
    console.error('Error fetching image list:', e);
  }
};

// fetch les images similaires
const fetchSimilarImages = async (id: number) => {
  try {
    similarImages.value = await api.getSimilarImages(id);
    similarImages.value = similarImages.value.slice(0, 3);
  } catch (e) {
    console.error('Error fetching similar images:', e);
    similarImages.value = [];
  }
};

// fetch image floue
const fetchFlouImage = async (id: number) => {
  try {
    const blob = await api.getImageFlou(id);
    const meta = imageList.value.find(img => img.id === id);
    if (meta) {
      imageFlou.value = { blob, meta };
    } else {
      console.warn('Image metadata not found for id', id);
      imageFlou.value = null;
    }
  } catch (e) {
    console.error('Error fetching flou image:', e);
    imageFlou.value = null;
  }
};

// Révoquer l'URL précédente quand image floue change
watch(imageFlou, (newVal) => {
  if (flouUrl.value) {
    URL.revokeObjectURL(flouUrl.value);
    flouUrl.value = null;
  }
  if (newVal?.blob) {
    flouUrl.value = URL.createObjectURL(newVal.blob);
  }
});

// Réagir à l'image aléatoire
watch(randomImageId, async (id) => {
  if (id !== null) {
    await fetchSimilarImages(id);
    await fetchFlouImage(id);
  } else {
    similarImages.value = [];
    imageFlou.value = null;
  }
});

// Images à afficher
const shuffledImages = computed(() => {
  if (!randomImageId.value) return [];
  const imagesSet = new Set([randomImageId.value, ...similarImages.value.map(img => img.id)]);
  const imagesArray = Array.from(imagesSet).map(id => {
    return imageList.value.find(img => img.id === id) || { id, name: 'Unknown' };
  });
  return imagesArray.sort(() => Math.random() - 0.5);
});

onMounted(fetchImageList);
</script>

<template>
  <div>
    <h3>Random Image</h3>
    <div v-if="randomImageId !== null && flouUrl">
      <p>Image ID: {{ randomImageId }}</p>
      <!-- 👇 ici, image floue -->
      <img :src="flouUrl" alt="Image floue" />
    </div>
    <div v-else>
      <p>Loading image...</p>
    </div>
  </div>

  <div>
    <div v-if="shuffledImages.length > 0">
      <h4>Images</h4>
      <div class="similar-images-container">
        <div v-for="image in shuffledImages" :key="image.id" class="similar-image">
          <router-link
            :to="{ name: 'Result', params: { id: image.id === randomImageId ? 0 : 1 } }"
          >
            <Image :id="image.id" />
          </router-link>
          <p>{{ image.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.similar-images-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.similar-image {
  text-align: center;
}

img {
  width: 300px;
  height: auto;
}
</style>
