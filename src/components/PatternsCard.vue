<template>
    <div class="patterns-card">
        <div
            v-for="(box, index) in images"
            :key="box.id"
            class="image-box cursor-move"
            :class="{ 'double-col': box.col === 2 }"
        @click="handleImageClick(index)"
        >
        <img v-if="box.src" :src="box.src" alt="Image" />
    </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    images: {
        type: Array,
        default: () => [], // 默认空数组
    },
});

const emit = defineEmits(['imageClick']);

// 处理图片点击事件
function handleImageClick(index: number) {
    emit('imageClick', index); // 触发父组件的点击事件
}
</script>

<style scoped>
.patterns-card {
    display: grid;
    grid-template-columns: repeat(4, 70px);
    grid-template-rows: repeat(12, 70px);
    gap: 0;
}

.image-box {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc; /* 虚线边框 */
}

.image-box img {
    max-width: 100%;
    max-height: 100%;
}

.double-col {
    grid-column: span 2; /* 占用两个格子 */
}
</style>
