<template>
    <div style="height: 100%; width: 100%;">
        <Vue3DraggableResizable
                :initW="initWidth"
                :initH="initHeight"
                v-model:x="x"
                v-model:y="y"
                v-model:w="computedWidth"
                v-model:h="computedHeight"
                v-model:active="active"
                :draggable="!lockVisible"
                :resizable="!lockVisible"
                :minWidth="100"
                :minHeight="100"
                :maxWidth="maxWidth"
                :maxHeight="maxHeight"
                @activated="handleActivate"
                @deactivated="handleDeactivate"
                @drag-start="handleDragStart"
                @resize-start="handleResizeStart"
                @dragging="handleDragging"
                @resizing="handleResizing"
                @drag-end="handleDragEnd"
                @resize-end="handleResizeEnd"
                v-show="!lockVisible"
        >
            <div class="card-container" ref="cardBody"
                 :style="{ border: '1px solid'+ headerBgColor,width: computedWidth + 'px', height: computedHeight + 'px'}">
                <div class="card-header" :style="{ backgroundColor: headerBgColor, color: headerTextColor }">
                    <span style="font-size: 25px;font-family: 'Acumin Variable Concept', sans-serif;">{{ headerText }}
                        <button class="close-btn" v-if="lockStatus && lockVisible" @click="changeLockVisible">
                            <LockOutlined />
                        </button>
                        <button class="close-btn" v-if="lockStatus && !lockVisible" @click="changeLockVisible">
                            <UnlockOutlined />
                        </button></span>
                    <button class="close-btn" style="font-size: 20px;" v-if="visible" @click="closeCard">
                        <CloseOutlined />
                    </button>
                </div>
                <div class="card-body" v-if="visible">
                    <slot></slot>
                </div>
                <div class="hidden-card-body" v-if="!visible">
                </div>
            </div>
        </Vue3DraggableResizable>

        <div
            v-show="lockVisible"
            :style="{
                position: 'absolute',
                top: y + 'px',
                left: x + 'px',
                width: computedWidth + 'px',
                height: computedHeight + 'px',
              }"
        >
        <div class="card-container" :style="{ border: '1px solid'+ headerBgColor,width: computedWidth + 'px',height: computedHeight + 'px'}">
            <div class="card-header" :style="{ backgroundColor: headerBgColor, color: headerTextColor }">
                    <span style="font-size: 25px;font-family: 'Acumin Variable Concept', sans-serif;">{{ headerText }}
                        <button class="close-btn" v-if="lockStatus && lockVisible" @click="changeLockVisible">
                            <LockOutlined />
                        </button>
                        <button class="close-btn" v-if="lockStatus && !lockVisible" @click="changeLockVisible">
                            <UnlockOutlined />
                        </button></span>
                <button class="close-btn" style="font-size: 20px;" v-if="visible" @click="closeCard">
                    <CloseOutlined />
                </button>
            </div>
            <div class="card-body" v-if="visible">
                <slot></slot>
            </div>
            <div class="hidden-card-body" v-if="!visible">
            </div>
        </div>
      </div>

    </div>
</template>

<script lang="ts" setup>
import {ref, defineProps, defineEmits, watch, onMounted} from 'vue';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import {
    LockFilled,
    UnlockFilled,LockOutlined,UnlockOutlined,
CloseOutlined
} from '@ant-design/icons-vue';
const props = defineProps({
    initX: {
        type: Number,
        default: 0
    },
    initY: {
        type: Number,
        default: 0
    },
    initWidth: {
        type: Number,
        default: 300
    },
    initHeight: {
        type: Number,
        default: 60
    },
    maxHeight: {
        type: Number,
        default: 800
    },
    maxWidth: {
        type: Number,
        default: 1200
    },
    headerText: {
        type: String,
        default: 'Card Title'
    },
    headerBgColor: {
        type: String,
        default: '#a966c4'
    },
    headerTextColor: {
        type: String,
        default: '#ffffff'
    },
    visible: {
        type: Boolean,
        default: false
    },
    lockStatus: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

//锁定卡片的状态
const lockVisible = ref(false);

// 定义组件内部的状态
const x = ref(props.initX);
const y = ref(props.initY);
const active = ref(false);

const initWidth = ref(props.initWidth);
const initHeight = ref(props.initHeight);

// 监听 visible 属性的变化
watch(() => props.visible, (newVal) => {
    if (!newVal) {
        // 当 visible 为 false 时，触发关闭逻辑
        closeCard();
    }
});

// 初始设置
onMounted(() => {
    if (cardBody.value) {
        const newWidth = Math.max(cardBody.value.scrollWidth); // 增加边距并确保最小宽度
        const newHeight = Math.max(cardBody.value.scrollHeight); // 增加边距并确保最小高度
        computedWidth.value = Math.min(newWidth, props.maxWidth); // 确保不超过最大宽度
        computedHeight.value = Math.min(newHeight, props.maxHeight); // 确保不超过最大高度
    }
});

// 关闭卡片的逻辑
function closeCard() {
    emit('changeVisible', false);
    computedWidth.value = 300; // 确保不超过最大宽度
    computedHeight.value = 60; // 确保不超过最大高度
}

function handleActivate() {
    console.log('Window activated');
}

function handleDeactivate() {
    console.log('Window deactivated');
}

function handleDragStart() {
    console.log('Drag start');
}

function handleResizeStart() {
    console.log('Resize start');
}

function handleDragging() {
    console.log('Dragging');
}

function handleResizing() {
    console.log('Resizing');
}

function handleDragEnd() {
    console.log('Drag end');
}

// 监视卡片内容的变化
const cardBody = ref(null);
// 计算属性，用于根据内容动态调整大小
const computedWidth = ref(props.initWidth);
const computedHeight = ref(props.initHeight);

function handleResizeEnd() {
    if (cardBody.value) {
        const newWidth = Math.max(cardBody.value.scrollWidth); // 增加边距并确保最小宽度
        const newHeight = Math.max(cardBody.value.scrollHeight); // 增加边距并确保最小高度
        computedWidth.value = Math.min(newWidth, props.maxWidth); // 确保不超过最大宽度
        computedHeight.value = Math.min(newHeight, props.maxHeight); // 确保不超过最大高度
    }
    console.log('handleResizeEnd');
    emit('changeVisible', true);
}

function closeWindow() {
    active.value = false; // 隐藏窗口
}

function changeLockVisible() {
    lockVisible.value = !lockVisible.value;
}

</script>

<style scoped>
.card-container {
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
}

.close-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: inherit;
}

.card-body {
    min-height: 20px;
    padding: 10px;
    font-size: 14px;
    background-color: white;
}

.hidden-card-body {
    height: 10px;
    background-color: white;
}

.locked {
    pointer-events: none; /* 禁用外层组件的鼠标事件 */
}
</style>
