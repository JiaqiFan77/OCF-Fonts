<template>
    <div >
        <div class="flex">
            <VueDraggable
                    ref="el"
                    v-model="list"
                    animation="150"
                    ghostClass="ghost"
                    class="flex flex-col gap-2 p-4 w-300px h-300px m-auto bg-gray-500/5 rounded"
                    @start="onStart"
                    @update="onUpdate"
            >
                <div
                        v-for="item in list"
                        :key="item.id"
                        class="cursor-move h-30 bg-gray-500/5 rounded p-3 cursor-move"
                >
                    {{ item.name }}
                </div>
            </VueDraggable>
        </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { VueDraggablePlus } from 'vue-draggable-plus';
export default defineComponent({
    name: 'App',
    components: {
        HelloWorld,
    },
    setup() {
        const list = ref([
            {
                name: 'Joao',
                id: 1,
            },
            {
                name: 'Jean',
                id: 2,
            },
            {
                name: 'Johanna',
                id: 3,
            },
            {
                name: 'Juan',
                id: 4,
            },
        ]);

        return { list };
    },
});
</script>
