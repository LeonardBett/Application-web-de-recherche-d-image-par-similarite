<script setup lang="ts">
import router from '../router';

const win_cond = defineProps<{ id: number }>()

function showGame() {
  router.push({ name: 'ImageQuest'})
}

</script>

<template>
  <div> 
    <p v-if ="win_cond.id === 0">Victoire</p>
    <p v-else-if ="win_cond.id === 1">Défaite</p>
  </div>
  <div><button @click="showGame"><router-link to="/ImageQuest">Aller au jeu</router-link></button></div>
</template>

<style></style>