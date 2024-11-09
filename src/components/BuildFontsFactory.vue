<template>
  <a-textarea
      v-model:value="outputInfo"
      rows="5"
      placeholder="选中的位置信息将显示在这里..."
  ></a-textarea>
  <div class="grid-container" ref="pdfContent">
    <div
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
        class="grid-row"
    >
      <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="grid-cell"
          :class="{ 'visible': isCellSelected(rowIndex, colIndex) }"
          @click="toggleCell(rowIndex, colIndex)"
      >
        <div v-if="isCellSelected(rowIndex, colIndex)" class="selected-cell"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const grid = Array.from({ length: 20 }, () => Array(20).fill(null));
const selectedCells = ref([]);
const outputInfo = ref('');

const toggleCell = (rowIndex, colIndex) => {
  const index = selectedCells.value.findIndex(cell => cell.x === colIndex && cell.y === rowIndex);
  if (index === -1) {
    selectedCells.value.push({ index: selectedCells.value.length, x: colIndex, y: rowIndex });
  } else {
    selectedCells.value.splice(index, 1);
  }
  updateOutputInfo();
};

const isCellSelected = (rowIndex, colIndex) => {
  return selectedCells.value.some(cell => cell.x === colIndex && cell.y === rowIndex);
};

const updateOutputInfo = () => {
  outputInfo.value = selectedCells.value
      .map(cell => `{index: ${cell.index}, x: ${cell.x}, y: ${cell.y} },`)
      .join('\n');
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(20, 35px);
  grid-template-rows: repeat(20, 35px);
  position: relative;
}

.grid-row {
  display: contents;
}

.grid-cell {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(0, 0, 0, 0.5); /* 辅助网格 */
  cursor: pointer;
}

.selected-cell {
  width: 70px;
  height: 70px;
  background-color: red; /* 选中的红色网格 */
}
</style>
