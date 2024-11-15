<template>
    <a-button class="text-button" @click="exportFontPDF">
        Export Single
    </a-button>
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
                :class="{ 'visible': isCellVisible(rowIndex, colIndex) }"
                :style="getCellStyle(rowIndex, colIndex)"
                @mousedown="(event) => startRotate(event, rowIndex, colIndex)"
                @mouseup="stopRotate"
                @mouseleave="stopRotate"
            >
                <img
                    v-if="isCellVisible(rowIndex, colIndex) && hasImage(rowIndex, colIndex)"
                    :src="getImageSource(rowIndex, colIndex)"
                    alt="Image"
                    :style="{ transform: `rotate(${getRotation(rowIndex, colIndex)}deg)` }"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineExpose, defineProps, onMounted, ref, watch} from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const props = defineProps({
    images: {
        type: Array,
        default: () => [],
    },
    operableCells: {
        type: Array,
        default: () => [],
    },
});

const grid = Array.from({ length: 20 }, () => Array(20).fill(null));
const pdfContent = ref(null);
let currentCellIndex = -1;
let rotationInterval = null;

watch(() => props.operableCells, (newCells) => {
    initializeGrid(newCells);
}, { immediate: true });

function initializeGrid(cells) {
    grid.forEach(row => row.fill(null));
    cells.forEach(cell => {
        const { index, x, y } = cell;
        grid[y][x] = { index, isFull: false }; // 在对应位置填充 index 和 isFull
    });
}

onMounted(() => {
    props.operableCells.forEach(cell => {
        cell.isFull = false; // 初始化isFull
    });
});

const exportFontPDF = async () => {
    const content = pdfContent.value; // 获取内容的 DOM 元素
    if (!content) return;

    // 临时隐藏边框
    const cells = content.querySelectorAll('.grid-cell.visible');
    cells.forEach(cell => {
        cell.style.border = 'none'; // 隐藏边框
    });

    // 捕捉内容为图像
    const canvas = await html2canvas(content, { scale: 5 }); // 缩小比例
    const imgData = canvas.toDataURL('image/png');

    // 创建 PDF 文档
    const pdf = new jsPDF('p', 'mm', 'a4');

    // 添加背景图
    const bgImage = new Image();
    bgImage.src = 'https://jiaqifan77.github.io/OCF-Fonts/images/bg1.png'; // 替换为你的背景图路径

    bgImage.onload = () => {
        const imgWidth = pdf.internal.pageSize.width;
        const imgHeight = pdf.internal.pageSize.height;

        // 添加背景图到 PDF
        pdf.addImage(bgImage, 'PNG', 0, 0, imgWidth, imgHeight);

        // 计算内容图像的宽度和高度
        const contentWidth = 150; // 缩小图像宽度，比如150mm
        const contentHeight = (canvas.height * contentWidth) / canvas.width; // 按比例计算内容高度

        // 计算居中位置
        const x = (pdf.internal.pageSize.width - contentWidth) / 2;
        const y = (pdf.internal.pageSize.height - contentHeight) / 2;

        // 添加内容图像到 PDF
        pdf.addImage(imgData, 'PNG', x, y, contentWidth, contentHeight);

        // 保存 PDF
        pdf.save('output.pdf');

        // 恢复边框样式
        cells.forEach(cell => {
            cell.style.border = ''; // 恢复边框样式
        });
    };
};





function isCellVisible(row: number, col: number): boolean {
    const cell = props.operableCells.find(c => c.x == col && c.y == row);
    return cell && !cell.isFull; // 如果格子已满，则不可见
}

function getImageSource(row: number, col: number): string | undefined {
    const cell = props.operableCells.find(c => c.x == col && c.y == row);
    return cell ? props.images[cell.index]?.src : undefined;
}

function getRotation(row: number, col: number): number {
    const cell = props.operableCells.find(c => c.x == col && c.y == row);
    return cell ? props.images[cell.index]?.rotation || 0 : 0;
}

function getCellStyle(row: number, col: number) {
    const cell = props.operableCells.find(c => c.x == col && c.y == row);
    const width = cell && props.images[cell.index]?.col == 2 ? '70px' : '70px';
    return { width, height: '70px' };
}

const startRotate = (event, rowIndex, colIndex) => {
    const cell = props.operableCells.find(c => c.x === colIndex && c.y === rowIndex);
    currentCellIndex = cell ? cell.index : -1;

    if (currentCellIndex !== -1) {
        rotationInterval = setInterval(() => {
            const rotation = (props.images[currentCellIndex].rotation || 0) + 2;
            props.images[currentCellIndex].rotation = rotation;
        }, 16);
    }
};

const stopRotate = () => {
    currentCellIndex = -1;
    clearInterval(rotationInterval);
};

function hasImage(row: number, col: number): boolean {
    const cell = props.operableCells.find(c => c.x === col && c.y === row);
    return cell && !cell.isFull && props.images[cell.index]?.src !== undefined; // 如果未填充，则返回图片
}

function placeImage(index: number) {
    let { x, y } = props.operableCells[index];
    const image = props.images[index];

    if (image.col === 2) {
        // 占用两个格子，检查右边的格子
        if (props.operableCells.some(cell => cell.x === x + 1 && cell.y === y && !cell.isFull)) {
            // 填充当前和右边的格子
            props.operableCells[index].isFull = true;
            const rightCell = props.operableCells.find(cell => cell.x === x + 1 && cell.y === y);
            if (rightCell) rightCell.isFull = true;
        }
    } else {
        // 占用一个格子
        props.operableCells[index].isFull = true;
    }

}
defineExpose({ exportFontPDF })
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
    cursor: grab;
}

.grid-cell.visible {
    border: 1px dashed #000;
}

.grid-cell img {
    max-width: 100%;
    max-height: 100%;
}

.grid-cell::before,
.grid-cell::after {
    content: '';
    position: absolute;
    border: 2px solid transparent; /* 边框颜色 */
}

.grid-cell::before {
    top: -2px; /* 上边框 */
    left: -2px;
    width: 740px; /* 单元格宽度 + 边框宽度 */
    height: 2px; /* 边框高度 */
}

.grid-cell::after {
    left: 68px; /* 右边框 */
    top: 68px; /* 底边框 */
    width: 2px; /* 边框宽度 */
    height: 74px; /* 单元格高度 + 边框宽度 */
}

.grid-cell::after {
    left: -2px; /* 左边框 */
    top: 68px; /* 底边框 */
    width: 74px; /* 单元格宽度 + 边框宽度 */
    height: 2px; /* 边框高度 */
}

.grid-cell img {
    max-width: 100%;
    max-height: 100%;
}

.text-button {
    border: 1px solid #060202;
    font-family: 'Acumin Variable Concept', sans-serif;
    margin-top: 15px;
    margin-left: 15px;
}
</style>
