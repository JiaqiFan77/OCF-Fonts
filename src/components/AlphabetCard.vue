<template>
    <a-button class="text-button" @click="exportPDF">
        Export All
    </a-button>
    <div>
        <div class="grid-container" ref="pdfContent">
            <div
                v-for="(box, index) in allFonts"
                :key="index"
                class="box"
                @click="handleClick(index)"
            >
                <div class="grid-container-1">
                <div
                    v-for="(row, rowIndex) in grid"
                    :key="rowIndex"
                    class="grid-row"
                >
                    <div
                        v-for="(cell, colIndex) in row"
                        :key="colIndex"
                        class="grid-cell"
                        :class="{ 'visible': isCellVisible(rowIndex, colIndex, index) }"
                        :style="getCellStyle(rowIndex, colIndex)"
                    >
                        <img
                            v-if="isCellVisible(rowIndex, colIndex, index) && hasImage(rowIndex, colIndex, index)"
                            :src="getImageSource(rowIndex, colIndex, index)"
                            alt="Image"
                        />
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref,defineExpose } from 'vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const props = defineProps({
    allFonts: {
        type: Array,
        default: () => [],
    }
});

const grid = Array.from({ length: 20 }, () => Array(20).fill(null));

function isCellVisible(row: number, col: number, boxIndex: number): boolean {
    return props.allFonts[boxIndex].operableCells.some(cell => cell.x === col && cell.y === row);
}

function getImageSource(row: number, col: number, boxIndex: number): string | undefined {
    const cell = props.allFonts[boxIndex].operableCells.find(cell => cell.x === col && cell.y === row);
    return cell ? props.allFonts[boxIndex].buildFontsCells[cell.index]?.src : undefined;
}

function getRotation(row: number, col: number, boxIndex: number): number {
    const cell = props.allFonts[boxIndex].operableCells.find(cell => cell.x === col && cell.y === row);
    return cell ? props.allFonts[boxIndex].buildFontsCells[cell.index]?.rotation || 0 : 0;
}

function hasImage(row: number, col: number, boxIndex: number): boolean {
    const cell = props.allFonts[boxIndex].operableCells.find(cell => cell.x === col && cell.y === row);
    return cell ? props.allFonts[boxIndex].buildFontsCells[cell.index]?.src !== undefined : false;
}

function getCellStyle(row: number, col: number) {
    return {
        width: '15px',
        height: '15px',
    };
}

const emit = defineEmits([]);

const handleClick = (index: number) => {
    emit('selectedCard', index); // 触发自定义事件，并传递索引
};

const pdfContent = ref(null);

// 导出PDF的方法
const exportPDF = async () => {
    const content = pdfContent.value; // 获取内容的 DOM 元素
    if (!content) return;

    // 临时隐藏边框
    const cells = content.querySelectorAll('.grid-cell.visible');
    cells.forEach(cell => {
        cell.style.border = 'none'; // 隐藏边框
    });

    const cell1 = content.querySelectorAll('.grid-cell.visible');
    cell1.forEach(cell => {
        cell.style.border = 'none'; // 隐藏边框
        cell.style.padding = '0'; // 设置内边距为0
    });

    // 临时缩小容器的样式
    const scale = 0.8; // 按比例缩小，例如 80%
    content.style.transform = `scale(${scale})`;
    content.style.transformOrigin = 'top left';

    // 让内容透明
    const originalBackgroundColor = content.style.backgroundColor;
    content.style.backgroundColor = 'transparent';

    console.log('开始导出 PDF。。。');

    const canvas = await html2canvas(content, { scale: 5 });
    const imgData = canvas.toDataURL('image/png');

    // 加载 bg.png 图片
    const bgImage = new Image();
    bgImage.src = 'https://jiaqifan77.github.io/OCF-Fonts/images/bg.png';

    const logoImage = new Image();
    logoImage.src = 'https://jiaqifan77.github.io/OCF-Fonts/images/logo.png';

    logoImage.onload = () => {
        bgImage.onload = async () => {
            const pdf = new jsPDF('p', 'mm', 'a4');

            // 添加其他内容图像
            const pdfImgWidth = 210 * scale; // 使用捕捉的宽度
            const pdfImgHeight = (canvas.height * pdfImgWidth) / canvas.width;

            // 计算居中位置
            const x = (pdf.internal.pageSize.width - pdfImgWidth) / 2;
            const y = (pdf.internal.pageSize.height - pdfImgHeight) / 2;

            // 添加背景图
            const imgWidth = pdf.internal.pageSize.width;
            const imgHeight = pdf.internal.pageSize.height;
            pdf.addImage(bgImage, 'PNG', 0, 0, imgWidth, imgHeight);

            // 添加内容图像
            pdf.addImage(imgData, 'PNG', x, y, pdfImgWidth, pdfImgHeight);

            // 添加 logo
            const logoWidth = 100;
            const logoHeight = (logoWidth * logoImage.height) / logoImage.width;
            const logoX = (pdf.internal.pageSize.width - logoWidth) + 30;
            const logoY = (pdf.internal.pageSize.height - logoHeight);
            pdf.addImage(logoImage, 'PNG', logoX, logoY, 40, 15);

            console.log('正在导出 PDF。。。');

            pdf.save('output.pdf');

            // 恢复容器的原始样式
            content.style.transform = ''; // 清除缩放
            content.style.backgroundColor = originalBackgroundColor; // 恢复原背景颜色

            // 恢复边框样式
            cells.forEach(cell => {
                cell.style.border = ''; // 恢复边框样式
            });

            cell1.forEach(cell => {
                cell.style.border = ''; // 恢复边框样式
                cell.style.padding = ''; // 恢复内边距
            });
        };
    };
};




defineExpose({ exportPDF })

</script>

<style scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(6, 145px); /* 每行6个框 */
    grid-gap: 10px; /* 每个框之间的间距 */
    box-sizing: border-box; /* 使宽度和高度包含内边距和边框 */
    width: calc(6 * 145px + 5 * 10px + 20px); /* 限制最大宽度，包含间距和边距 */
    margin: 0 auto; /* 使容器居中 */
    padding: 10px;
    /*overflow: scroll;*/
}

.grid-container-1 {
    display: grid;
    grid-template-columns: repeat(20, 7px);
    grid-template-rows: repeat(20, 7px);
    position: relative;
}

.box {
    width: 145px;
    height: 145px;
    display: flex;
    align-items: center;
    justify-content: center; /* 垂直和水平居中 */
    border: 1px dashed #000; /* 虚线框 */
    box-sizing: border-box; /* 使宽度和高度包含内边距和边框 */
}

.export-btn {
    text-align: right; /* 右对齐 */
    margin-top: 200px; /* 顶部外边距 */
}

.grid-row {
    display: contents;
}

.grid-cell {
    width: 15px;
    height: 15px;
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

.text-button {
    border: 1px solid #060202;
    font-family: 'Acumin Variable Concept', sans-serif;
    margin-top: 2px;
    margin-left: 12px;
}
</style>
