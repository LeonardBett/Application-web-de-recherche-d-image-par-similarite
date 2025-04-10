<script setup lang="ts">
import router from '../router';

const win_cond = defineProps<{ id: number }>()

function showGame() {
  router.push({ name: 'ImageQuest'})
}

</script>

<template>
  <div> 
    <p v-if ="win_cond.id === 0"><h1 class="win">Victoire</h1></p>
    <p v-else-if ="win_cond.id === 1"><h1 class="loose">Défaite</h1></p>
  </div>
  <div v-if ="win_cond.id === 0">
    <p>Tu peux maintenant accéder au jeux avec le bonus de ton choix :</p>
    <button @click="showGame"><router-link to="/ImageQuest">Bonus 1</router-link></button>
    <button @click="showGame"><router-link to="/ImageQuest">Bonus 2</router-link></button>
    <button @click="showGame"><router-link to="/ImageQuest">Bonus 3</router-link></button>
  </div>
  <div v-else-if ="win_cond.id === 1">
    <p>Tu peux maintenant accéder au jeux sans bonus &#128542; :</p>
    <button @click="showGame"><router-link to="/ImageQuest">Aller au jeu</router-link></button>
  </div>
</template>

<style>
.win {
  color: green;
  font-weight: bold;
}

.loose {
  color: red;
  font-weight: bold;
}
</style>