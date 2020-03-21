<template>
  <div style="height: 100%; background-color: #d6f5f5;">
    <board-header></board-header>
    <main>
      这里是主要部分
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BoardHeader from './components/board-header';

@Component({
  components: {
    BoardHeader
  }
})
export default class Board extends Vue {
}
</script>
