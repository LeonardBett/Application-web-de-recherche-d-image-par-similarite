<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
// @ts-ignore
import GameEngine from "../game/Engine.js"
import { api } from "../http-api.js";
import type { ImageType } from '../image';

const bonus_active = defineProps<{ id: number }>()

let gameInstance = ref<GameEngine | null>(null);
const playerImageId = ref(0);
const ennemiImageId = ref(1);
const imageList = ref<ImageType[]>([]);
let similarEnnemiList = ref<ImageType[]>([]);
let isActive = ref<boolean>(true);

onMounted(() => {
  getImageList();
  loadEnnemiSimilar();
});

onUnmounted(() => {
  if (gameInstance.value != null) {
    gameInstance.value.game.destroy(true);
  }
});

function getImageList() {
  api.getImageList().then((data) => {
    imageList.value = data;
  }).catch(e => {
    console.log(e.message);
  });
}

function loadEnnemiSimilar() {
  api.getSimilarImages(ennemiImageId.value).then((data) => {
    similarEnnemiList.value = data;

    //filtrage de la liste des images similaires avec 3 element max, et sans celle selectionne comme personnage te ennemie principale
    const similarTemp = ref<ImageType[]>([]);
    let i = 0;
    similarEnnemiList.value.forEach(function (imageId) {
      if (i < 3 && imageId.id != playerImageId.value && imageId.id != ennemiImageId.value) {
        similarTemp.value.push(imageId);
        i++;
      }
    });
    similarEnnemiList.value = similarTemp.value;
  }).catch(e => {
    console.log(e.message);
  });
}

function startGame() {
  if (gameInstance.value != null) {
    gameInstance.value.game.destroy(true);
  }
  isActive.value = false;

  let ennemieList = [];
  for(let i=0; i<similarEnnemiList.value.length;i++){
    ennemieList.push(similarEnnemiList.value[i].id);
  }
  ennemieList.push(ennemiImageId.value)

  gameInstance.value = new GameEngine("gameId", playerImageId,ennemieList,0,bonus_active);
  gameInstance.value.initialise();
}
</script>

<template>
  <div v-if="isActive">
    <div v-if="bonus_active.id == 1">
      <p>Bonus de 10 points appliqués !</p>
    </div>
    <div>
      <button @click="startGame">Start game !</button>
    </div>

    <div>
      <h1>Choose an hero</h1>
      <div>
        <select v-model="playerImageId">
          <option v-for="image in imageList" :value="image.id" :key="image.id">{{ image.name }}</option>
        </select>
      </div>
      <img :src="`/images/${playerImageId}`">
      <h1>Choose an ennemi</h1>
      <div>
        <select v-model="ennemiImageId" @change="loadEnnemiSimilar">
          <option v-for="image in imageList" :value="image.id" :key="image.id">{{ image.name }}</option>
        </select>
      </div>
      <img :src="`/images/${ennemiImageId}`">
    </div>
    <div>
      <h1>And there is his team</h1>
      <div v-if="similarEnnemiList.length > 0">
        <div>
          <img v-for="image in similarEnnemiList" :key="image.id" :src="`http://localhost:8080/images/${image.id}`"
            :alt="image.name" />
        </div>
      </div>
    </div>
  </div>

  <div id="gameId"></div>
</template>

<style scoped>
img {
  width: auto;
  height: auto;
  max-width: 150px;
  max-height: 100px;
}

Image {
  width: auto;
  height: auto;
  max-width: 150px;
  max-height: 100px;
}
</style>