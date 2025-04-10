<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { api } from '../http-api';
import type { ImageType } from '../image';
import Image from './Image.vue';


const imageList = ref<ImageType[]>([]);
const randomImageId = ref<number | null>(null);
const similarImages = ref<ImageType[]>([]);

const imageModif = ref<Blob | null>(null);
const modifImageId = ref<number | null>(null); // New variable to store the modified image ID

const props = defineProps<{ id: number }>()

const fetchImageList = async () => {
  try {
    imageList.value = await api.getImageList();
    if (imageList.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * imageList.value.length);
      const selected = imageList.value[randomIndex].id;
      randomImageId.value = selected === 0 ? 1 : selected;
    }
  } catch (e) {
    console.error('Error fetching image list:', e);
  }
};

const fetchSimilarImages = async (id: number) => {
  try {
    similarImages.value = await api.getSimilarImages(id);
    similarImages.value = similarImages.value.slice(0, 3);
  } catch (e) {
    console.error('Error fetching similar images:', e);
    similarImages.value = [];
  }
};

const fetchFlouImage = async (id: number) => {
  try {
    imageModif.value = await api.getImageModif(id,1);
    modifImageId.value = id;
    injectImageFloue(id, imageModif.value);
  } catch (e) {
    console.error('Error fetching flou image:', e);
  }
};

const injectImageZoom = (id: number, blob: Blob) => {
  const reader = new FileReader();
  reader.onload = () => {
    const gallery = document.getElementById(`gallery-${id}`);
    if (gallery) {
      gallery.innerHTML = `<img src="${reader.result}" style="width:300px;">`;
    }
  };
  reader.readAsDataURL(blob);
};

const fetchZoomImage = async (id: number) => {
  try {
    imageModif.value = await api.getImageModif(id,2);
    modifImageId.value = id; 
    injectImageZoom(id, imageModif.value);
  } catch (e) {
    console.error('Error fetching zoom image:', e);
  }
};

const injectImageFloue = (id: number, blob: Blob) => {
  const reader = new FileReader();
  reader.onload = () => {
    const gallery = document.getElementById(`gallery-${id}`);
    if (gallery) {
      gallery.innerHTML = `<img src="${reader.result}" style="width:300px;">`;
    }
  };
  reader.readAsDataURL(blob);
};

watch(randomImageId, async (id) => {
  if (id !== null) {
    await fetchSimilarImages(id);

    if(props.id == 1){
      await fetchFlouImage(id);
    }
    else if(props.id == 2){
      await fetchZoomImage(id);
    }
  } else {
    similarImages.value = [];
    imageModif.value = null;
    modifImageId.value = null;
  }
});

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
  <div v-if ="id === 0">
    <p>Quel niveau va tu choisir cher joueur ?</p>
    <button><router-link to="/QuizzImage/1">Facile</router-link></button>
    <button><router-link to="/QuizzImage/2">Moyen</router-link></button>
    <button><router-link to="/QuizzImage/3">Dur</router-link></button>
  </div>
  <div v-else>
  <div>
    <h3>Modified Image</h3>
    <div v-if="modifImageId !== null">
      <p>Image ID: {{ modifImageId }}</p>
      <figure :id="'gallery-' + modifImageId"></figure>
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
