<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
// @ts-ignore
import GameEngine from "../game/Engine.js"
import {api} from "../http-api.js";
//import router from "../router.js";
import type { ImageType } from '../image';
import Image from "./Image.vue";

let gameInstance = ref<GameEngine | null>(null);
const playerImageId = ref(0);
const ennemiImageId = ref(1);
const imageList = ref<ImageType[]>([]);
const similarEnnemiList = ref<ImageType[]>([]);


onMounted(() => {
  getImageList();
});

onUnmounted(() => {
  if(gameInstance.value != null){
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
    console.log(similarEnnemiList);
  }).catch(e => {
    console.log(e.message);
  });
}

/*function startGame() {
  //router.push({ name: 'image', params: { id: selectedId.value } })
  if(gameInstance.value != null){
    gameInstance.value.game.destroy(true);
  }
  gameInstance.value = new GameEngine("gameId",playerImageId);
  gameInstance.value.initialise();
}*/
</script>

<template>
  <div>
    <h1>Choose an hero</h1>
    <div>
      <select v-model="playerImageId">
        <option v-for="image in imageList" :value="image.id" :key="image.id">{{ image.name }}</option>
      </select>
    </div>
    <img :src= "`/images/${playerImageId}`" >

    <h1>Choose an ennemi</h1>
    <div>
      <select v-model="ennemiImageId" @change="loadEnnemiSimilar">
        <option v-for="image in imageList" :value="image.id" :key="image.id">{{ image.name }}</option>
      </select>
    </div>
    <img :src= "`/images/${ennemiImageId}`" >
  </div>

  <div>
    <h1>His gang</h1>
    <div v-if="similarEnnemiList.length > 0">
      <div>
        <Image v-for="image in similarEnnemiList" :key="image.id" :id="image.id" />
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
</style>