<template lang="html">
  <div @contextmenu="openMenu" @click="closeMenu" class="ctx-menu">
    <slot></slot>
    <div
    :style="ctxStyle"
     class="ctx-menu-content">
      <ul>
        <li v-for="item in items" @click="itemClick(item)">{{ item.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script src="./ctx-menu.js">
</script>

<style lang="css" src="./ctx-menu.css"></style>