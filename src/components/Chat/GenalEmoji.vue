<template>
  <div class="emoji_container">
    <div class="emoji-content-item">
      <span @click="addEmoji('😃')">😃</span>
      <span @click="addEmoji('😁')">😁</span>
      <span @click="addEmoji('😂')">😂</span>
      <span @click="addEmoji('😄')">😄</span>
      <span @click="addEmoji('😅')">😅</span>
      <span @click="addEmoji('😆')">😆</span>
      <span @click="addEmoji('😇')">😇</span>
      <span @click="addEmoji('😈')">😈</span>
      <span @click="addEmoji('😉')">😉</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😊')">😊</span>
      <span @click="addEmoji('😋')">😋</span>
      <span @click="addEmoji('😌')">😌</span>
      <span @click="addEmoji('😍')">😍</span>
      <span @click="addEmoji('😎')">😎</span>
      <span @click="addEmoji('😏')">😏</span>
      <span @click="addEmoji('😐')">😐</span>
      <span @click="addEmoji('😒')">😒</span>
      <span @click="addEmoji('😓')">😓</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('❓')">❓</span>
      <span @click="addEmoji('😕')">😕</span>
      <span @click="addEmoji('😖')">😖</span>
      <span @click="addEmoji('😗')">😗</span>
      <span @click="addEmoji('😘')">😘</span>
      <span @click="addEmoji('😙')">😙</span>
      <span @click="addEmoji('😚')">😚</span>
      <span @click="addEmoji('😜')">😜</span>
      <span @click="addEmoji('😝')">😝</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😞')">😞</span>
      <span @click="addEmoji('😟')">😟</span>
      <span @click="addEmoji('😠')">😠</span>
      <span @click="addEmoji('😡')">😡</span>
      <span @click="addEmoji('😢')">😢</span>
      <span @click="addEmoji('😣')">😣</span>
      <span @click="addEmoji('😤')">😤</span>
      <span @click="addEmoji('😥')">😥</span>
      <span @click="addEmoji('😦')">😦</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😨')">😨</span>
      <span @click="addEmoji('😩')">😩</span>
      <span @click="addEmoji('😪')">😪</span>
      <span @click="addEmoji('😫')">😫</span>
      <span @click="addEmoji('😬')">😬</span>
      <span @click="addEmoji('😭')">😭</span>
      <span @click="addEmoji('😮')">😮</span>
      <span @click="addEmoji('😯')">😯</span>
      <span @click="addEmoji('😰')">😰</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😲')">😲</span>
      <span @click="addEmoji('😳')">😳</span>
      <span @click="addEmoji('😴')">😴</span>
      <span @click="addEmoji('😵')">😵</span>
      <span @click="addEmoji('🧐')">🧐</span>
      <span @click="addEmoji('😷')">😷</span>
      <span @click="addEmoji('🙁')">🙁</span>
      <span @click="addEmoji('🙂')">🙂</span>
      <span @click="addEmoji('🙃')">🙃</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('🤐')">🤐</span>
      <span @click="addEmoji('🤑')">🤑</span>
      <span @click="addEmoji('🤒')">🤒</span>
      <span @click="addEmoji('🤓')">🤓</span>
      <span @click="addEmoji('🤔')">🤔</span>
      <span @click="addEmoji('🤕')">🤕</span>
      <span @click="addEmoji('🤠')">🤠</span>
      <span @click="addEmoji('🤡')">🤡</span>
      <span @click="addEmoji('🤢')">🤢</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('🤤')">🤤</span>
      <span @click="addEmoji('🤥')">🤥</span>
      <span @click="addEmoji('🤧')">🤧</span>
      <span @click="addEmoji('🤨')">🤨</span>
      <span @click="addEmoji('🤩')">🤩</span>
      <span @click="addEmoji('🤪')">🤪</span>
      <span @click="addEmoji('🤫')">🤫</span>
      <span @click="addEmoji('🤬')">🤬</span>
      <span @click="addEmoji('🤭')">🤭</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from "vue";
export default defineComponent({
  name: "GenalEmoji",
  emits: ['addEmoji'],
  setup(props, content: SetupContext) {

    // emoji子传父
    const addEmoji = (emoji: string) => {
      content.emit('addEmoji', emoji);
    }
    return {
      addEmoji
    }
  }
})
</script>

<style lang="scss" scoped>
.emoji_container {
  width: 250px;
  color: #000;
  font-size: 20px;
  // 禁止文字被鼠标选中
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .emoji-content-item {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: nowrap;
    span {
      cursor: pointer;
    }
  }
}
</style>
