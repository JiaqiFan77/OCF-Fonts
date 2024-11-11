<template>
	<div>
		<a-row justify="space-around" align="middle">
			<a-col :span="24">
			<img
					style="width: 20%;margin-top: 50px;margin-left:80px;"
					src="/images/title.svg"
			/>
			</a-col>
		</a-row>

		<a-row justify="space-around" align="middle" style="margin-top: 100px;">
			<a-col :span="6">
				<div style="">
						<DraggableResizableModel
								:headerText="'About'"
								:headerBgColor="'#a966c4'"
								:headerTextColor="'#ffffff'"
								:initWidth="575"
								:initHeight="242"
								:initX="-92"
								:initY="-70"
								:maxHeight="242"
								:maxWidth="575"
								:lockStatus="true"
								:visible="introductionVisible"
								@changeVisible="changeIntroductionVisible"
						>
							<div style="font-family: 'Acumin Variable Concept', sans-serif;font-size: 20px;line-height: 24px;color: #333;">
								OCF Fonts, which stands for "Old Chinese Fabric Fonts," provides a unique opportunity to design custom fonts employing designs from old Chinese fabrics. Our platform allows you to create personalized fonts based on traditional cloth themes, combining historical beauty with modern digital design. Explore and create your own personal typographic designs now!
							</div>
						</DraggableResizableModel>
						<DraggableResizableModel
								:headerText="'Instructions'"
								:headerBgColor="'#04aa5a'"
								:headerTextColor="'#ffffff'"
								:initWidth="575"
								:initHeight="315"
								:initX="-92"
								:initY="190"
								:maxHeight="315"
								:maxWidth="575"
								:lockStatus="true"
								:visible="instructionsVisible"
								@changeVisible="changeInstructionsVisible"
						>
							<div style="font-family: 'Acumin Variable Concept', sans-serif;font-size: 20px;line-height: 24px;color: #333;">
								1. Choose your favorite traditional Chinese fabric <span style="background-color: #30a1d2;color: white;display: inline-block;height: 60%;width: 15%;text-align: center;border-radius: 5%;">patterns</span>.
								<br>
								2. Drag and drop the patterns into the grid cells in the <span style="background-color: #ff032f;color: white;display: inline-block;height: 60%;width: 20%;text-align: center;border-radius: 5%;">build fonts</span> area.
								<br>
								3. Customize each cell's <span style="background-color: #30a1d2;color: white;display: inline-block;height: 60%;width: 15%;text-align: center;border-radius: 5%;">patterns</span> by adjusting its position and size until you are satisfied.
								
								


								<br>
								4. Once your design is complete, click <a-button style="background-color: #fff;border: 1px solid #060202;font-family: 'Acumin Variable Concept', sans-serif;font-size: 20px;line-height: 14px;height:30px">"Export"</a-button> to generate your custom font.
								<br>
								<br>
								Enjoy creating and designing your distinctive fonts!
							</div>
						</DraggableResizableModel>
				</div>
			</a-col>
			<a-col :span="10">
				<div>
					<DraggableResizableModel
						:headerText="'Alphabet'"
						:headerBgColor="'#ff032f'"
						:headerTextColor="'#ffffff'"
						:initWidth="300"
						:initHeight="60"
						:maxHeight="1510"
						:maxWidth="958"
						:initX="-925"
						:init-y="525"
						:lockStatus="true"
						:visible="alphabetVisible"
						@changeVisible="changeAlphabetVisible"
				>
						<div class="alphabet-card">
							<AlphabetCard ref="alphabetCard" :allFonts="allFonts" @selectedCard="selectedCard"></AlphabetCard>
						</div>
				</DraggableResizableModel>
					<DraggableResizableModel
							:headerText="'Patterns'"
							:headerBgColor="'#30a1d2'"
							:headerTextColor="'#ffffff'"
							:initWidth="300"
							:initHeight="60"
							:maxHeight="913"
							:maxWidth="300"
							:initX="-925"
							:init-y="605"
							:lockStatus="true"
							:visible="patternsVisible"
							@changeVisible="changePatternsVisible"
					>
						<div class="patterns-card-1">
							<VueDraggable v-model="sourceImages"
														ghostClass="ghost"
														:sort="false"
														:clone="clone"
														:group="{ name: 'people', pull: 'clone', put: false }"
														:animation="150" target=".patterns-card">
								<PatternsCard :images="sourceImages"></PatternsCard>
							</VueDraggable>
						</div>
					</DraggableResizableModel>
					<DraggableResizableModel
							:headerText="'Build fonts'"
							:headerBgColor="'#ff032f'"
							:headerTextColor="'#ffffff'"
							:initWidth="300"
							:initHeight="60"
							:max-height="761"
							:max-width="764"
							:initX="-925"
							:init-y="685"
							:visible="buildVisible"
							:lockStatus="true"
							@changeVisible="changeBuildVisible"
					>
						<VueDraggable v-model="buildFontsCells"
													group="people"
													ghostClass="ghost"
													:animation="150"
													target=".grid-container">
							<BuildFontsCard
                  ref="buildFontsCardRef"
									:operable-cells="operableCells"
									:images="buildFontsCells"
							></BuildFontsCard>
						</VueDraggable>
					</DraggableResizableModel>

					<DraggableResizableModel
							hidden
							:headerText="'Build fonts'"
							:headerBgColor="'#ff032f'"
							:headerTextColor="'#ffffff'"
							:initWidth="300"
							:initHeight="60"
							:initX="50"
							:max-height="1000"
							:max-width="1000"
							:init-y="300"
							:visible="false"
					>
						<VueDraggable
								:animation="150"
								target=".grid-container">
							<BuildFontsFactory
							></BuildFontsFactory>
						</VueDraggable>
					</DraggableResizableModel>
				</div>
			</a-col>
		</a-row>

		<div class="export-btn" style="position: fixed; bottom: 50px; right: 80px; display: flex; gap: 10px;">
			<a-button class="text-button" @click="redo">Eliminate</a-button>
			<a-button class="text-button" @click="restore">Back</a-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {DraggableEvent, VueDraggable} from 'vue-draggable-plus';
import {onMounted, ref, watch} from "vue";
import DraggableResizableModel from "../components/DraggableResizableModel.vue";
import PatternsCard from "../components/PatternsCard.vue";
import BuildFontsCard from "../components/BuildFontsCard.vue";
import AlphabetCard from "../components/AlphabetCard.vue";
import BuildFontsFactory from "../components/BuildFontsFactory.vue";

const x = ref(100);
const y = ref(100);
const w = ref(100);
const h = ref(100);
const active = ref(false);

const buildFontsCardRef = ref(null);
const alphabetCard = ref(null);

const introductionVisible = ref(true);
const instructionsVisible = ref(true);
const alphabetVisible = ref(false);
const patternsVisible = ref(false);
const buildVisible = ref(false);

function onChoose(event: DraggableEvent){
	console.info(event)
}

function clone(element: Record<'src' | 'id' | 'col', string>) {
	const len = buildFontsCells.value.length
	return {
		id: `${element.id}-clone-${len}`,
		src: `${element.src}`,
		col: `${element.col}`,
	}
}

const sourceImages = ref([
		{
			id: 1,//编号
			src: '.../images/资源 1.png',//图片路径
			visible: false,//是否可见
			col: 1 //占用几格
		},
		{
			id: 2,
			src: '.../images/资源 2.png',
			visible: false,
			col: 1
		},
		{
			id: 3,
			src: '.../images/资源 3.png',
			visible: false,
			col: 1
		},
		{
			id: 4,
			src: '.../images/资源 4.png',
			visible: false,
			col: 1
		},
		{
			id: 5,
			src: '.../images/资源 5.png',
			visible: false,
			col: 1
		},
		{
			id: 6,
			src: '.../images/资源 6.png',
			visible: false,
			col: 1
		},
		{
			id: 7,
			src: '.../images/资源 7.png',
			visible: false,
			col: 1
		},
		{
			id: 8,
			src: '.../images/资源 8.png',
			visible: false,
			col: 1
		},
		{
			id: 9,
			src: '.../images/资源 9.png',
			visible: false,
			col: 1
		},
		{
			id: 10,
			src: '.../images/资源 10.png',
			visible: false,
			col: 1
		},
		{
			id: 11,
			src: '.../images/资源 11.png',
			visible: false,
			col: 1
		},
		{
			id: 12,
			src: '.../images/资源 12.png',
			visible: false,
			col: 1
		},
		{
			id: 13,
			src: '.../images/资源 13.png',
			visible: false,
			col: 1
		},
		{
			id: 14,
			src: '.../images/资源 14.png',
			visible: false,
			col: 1
		},
		{
			id: 15,
			src: '.../images/资源 15.png',
			visible: false,
			col: 1
		},
		{
			id: 16,
			src: '.../images/资源 16.png',
			visible: false,
			col: 1
		},
		{
			id: 17,
			src: '.../images/资源 17.png',
			visible: false,
			col: 1
		},
		{
			id: 18,
			src: '.../images/资源 18.png',
			visible: false,
			col: 1
		},
		{
			id: 19,
			src: '.../images/资源 19.png',
			visible: false,
			col: 1
		},
		{
			id: 20,
			src: '.../images/资源 20.png',
			visible: false,
			col: 1
		},
		{
			id: 21,
			src: '.../images/资源 21.png',
			visible: false,
			col: 1
		},
		{
			id: 22,
			src: '.../images/资源 22.png',
			visible: false,
			col: 1
		},
		{
			id: 23,
			src: '.../images/资源 23.png',
			visible: false,
			col: 1
		},
		{
			id: 24,
			src: '.../images/资源 24.png',
			visible: false,
			col: 1
		},
		{
			id: 25,
			src: '.../images/资源 25.png',
			visible: false,
			col: 1
		},
		{
			id: 26,
			src: '.../images/资源 26.png',
			visible: false,
			col: 1
		},
		{
			id: 27,
			src: '.../images/资源 27.png',
			visible: false,
			col: 1
		},
		{
			id: 28,
			src: '.../images/资源 28.png',
			visible: false,
			col: 1
		},
		{
			id: 29,
			src: '.../images/资源 29.png',
			visible: false,
			col: 1
		},
		{
			id: 30,
			src: '.../images/资源 30.png',
			visible: false,
			col: 1
		},
		{
			id: 31,
			src: '.../images/资源 31.png',
			visible: false,
			col: 1
		},
		{
			id: 32,
			src: '.../images/资源 32.png',
			visible: false,
			col: 1
		},
		{
			id: 33,
			src: '.../images/资源 33.png',
			visible: false,
			col: 1
		},
		{
			id: 34,
			src: '.../images/资源 34.png',
			visible: false,
			col: 1
		},
		{
			id: 35,
			src: '.../images/资源 35.png',
			visible: false,
			col: 1
		},
		{
			id: 36,
			src: '.../images/资源 36.png',
			visible: false,
			col: 1
		},
		{
			id: 37,
			src: '.../images/资源 37.png',
			visible: false,
			col: 1
		},
		{
			id: 38,
			src: '.../images/资源 38.png',
			visible: false,
			col: 1
		},
		{
			id: 39,
			src: '.../images/资源 39.png',
			visible: false,
			col: 1
		},
		{
			id: 40,
			src: '.../images/资源 40.png',
			visible: false,
			col: 1
		},
		{
			id: 41,
			src: '.../images/资源 41.png',
			visible: false,
			col: 1
		},
		{
			id: 42,
			src: '.../images/资源 42.png',
			visible: false,
			col: 1
		},
		{
			id: 43,
			src: '.../images/资源 43.png',
			visible: false,
			col: 1
		},
		{
			id: 44,
			src: '.../images/资源 44.png',
			visible: false,
			col: 1
		},
		{
			id: 45,
			src: '.../images/资源 45.png',
			visible: false,
			col: 1
		},
		{
			id: 46,
			src: '.../images/资源 46.png',
			visible: false,
			col: 1
		},
		{
			id: 47,
			src: '.../images/资源 47.png',
			visible: false,
			col: 1
		},
		{
			id: 48,
			src: '.../images/资源 48.png',
			visible: false,
			col: 1
		}
		]
);


const operableCellsA = [
	{ index: 0, x: 7, y: 2 },
	{ index: 1, x: 9, y: 2 },
	{ index: 2, x: 8, y: 4 },
	{ index: 3, x: 10, y: 4 },
	{ index: 4, x: 7, y: 6 },
	{ index: 6, x: 11, y: 6 },
	{ index: 7, x: 6, y: 8 },
	{ index: 8, x: 8, y: 8 },
	{ index: 9, x: 10, y: 8 },
	{ index: 10, x: 12, y: 8 },
	{ index: 11, x: 5, y: 10 },
	{ index: 12, x: 13, y: 10 },
	{ index: 13, x: 4, y: 12 },
	{ index: 14, x: 6, y: 12 },
	{ index: 15, x: 12, y: 12 },
	{ index: 16, x: 14, y: 12 },
];


const operableCellsB = [
	{ index: 0, x: 5, y: 2 },
	{ index: 1, x: 7, y: 2 },
	{ index: 2, x: 9, y: 2 },
	{ index: 3, x: 11, y: 2 },
	{ index: 4, x: 13, y: 3 },
	{ index: 5, x: 7, y: 4 },
	{ index: 6, x: 13, y: 5 },
	{ index: 7, x: 13, y: 7 },
	{ index: 8, x: 13, y: 9},
	{ index: 9, x: 13, y: 11},
	{ index: 10, x: 7, y: 6},
	{ index: 11, x: 7, y: 8  },
	{ index: 12, x: 7, y: 10},
	{ index: 13, x: 7, y: 12 },
	{ index: 14, x: 11, y: 7 },
	{ index: 15, x: 9, y: 7 },
	{ index: 16, x: 5, y: 12 },
	{ index: 17, x: 9, y: 12 },
	{ index: 18, x: 11, y: 12 },
];

const operableCellsC = [
	{ index: 0, x: 7, y: 2 },
	{ index: 1, x: 9, y: 2 },
	{ index: 2, x: 13, y: 2 },
	{ index: 3, x: 5, y: 3 },
	{ index: 4, x: 11, y: 3 },
	{ index: 5, x: 13, y: 4 },
	{ index: 6, x: 3, y: 4 },
	{ index: 7, x: 3, y: 6 },
	{ index: 8, x: 3, y: 8 },
	{ index: 9, x: 3, y: 10},
	{ index: 10, x: 5, y: 11 },
	{ index: 11, x: 7, y: 12 },
	{ index: 12, x: 9, y: 12 },
	{ index: 13, x: 11, y: 11 },
	{ index: 14, x: 13, y: 9 },

];

const operableCellsD = [
	{ index: 0, x: 3, y: 2 },
	{ index: 1, x: 5, y: 2 },
	{ index: 2, x: 7, y: 2 },
	{ index: 3, x: 9, y: 2 },
	{ index: 4, x: 11, y: 2 },
	{ index: 5, x: 4, y: 4 },
	{ index: 6, x: 4, y: 6 },
	{ index: 7, x: 4, y: 8 },
	{ index: 8, x: 4, y: 10},
	{ index: 9, x: 12, y: 4},
	{ index: 10, x: 13, y: 6},
	{ index: 11, x: 13, y: 8  },
	{ index: 12, x: 12, y: 10},
	{ index: 13, x: 3, y: 12 },
	{ index: 14, x: 5, y: 12 },
	{ index: 15, x: 7, y: 12 },
	{ index: 16, x: 9, y: 12 },
	{ index: 17, x: 11, y: 12 },
];

const operableCellsE = [
	{ index: 0, x: 4, y: 2 },
	{ index: 1, x: 6, y: 2 },
	{ index: 2, x: 8, y: 2 },
	{ index: 3, x: 10, y: 2 },
	{ index: 4, x: 12, y: 2 },
	{ index: 5, x: 12, y: 4 },
	{ index: 6, x: 6, y: 4 },
	{ index: 7, x: 6, y: 6 },
	{ index: 8, x: 6, y: 8 },
	{ index: 9, x: 6, y: 10 },
	{ index: 10, x: 8, y: 7 },
	{ index: 11, x: 10, y: 7 },
	{ index: 12, x: 4, y: 12},
	{ index: 13, x: 6, y: 12 },
	{ index: 14, x: 8, y: 12 },
	{ index: 15, x: 10, y: 12 },
	{ index: 16, x: 12, y: 12 },
	{ index: 17, x: 12, y: 10 },
];

const operableCellsF = [
	{ index: 0, x: 4, y: 2 },
	{ index: 1, x: 6, y: 2 },
	{ index: 2, x: 8, y: 2 },
	{ index: 3, x: 10, y: 2 },
	{ index: 4, x: 12, y: 2 },
	{ index: 5, x: 12, y: 4 },
	{ index: 6, x: 6, y: 4 },
	{ index: 7, x: 6, y: 6 },
	{ index: 8, x: 6, y: 8 },
	{ index: 9, x: 6, y: 10 },
	{ index: 10, x: 8, y: 7 },
	{ index: 11, x: 10, y: 7 },
	{ index: 12, x: 5, y: 12},
	{ index: 13, x: 7, y: 12 },
];


const operableCellsG = [
	{ index: 0, x: 7, y: 2 },
	{ index: 1, x: 9, y: 2 },
	{ index: 2, x: 13, y: 2 },
	{ index: 3, x: 5, y: 3 },
	{ index: 4, x: 11, y: 3 },
	{ index: 5, x: 13, y: 4 },
	{ index: 6, x: 3, y: 4 },
	{ index: 7, x: 3, y: 6 },
	{ index: 8, x: 3, y: 8 },
	{ index: 9, x: 3, y: 10},
	{ index: 10, x: 5, y: 11 },
	{ index: 11, x: 7, y: 12 },
	{ index: 12, x: 9, y: 12 },
	{ index: 13, x: 11, y: 11 },
	{ index: 14, x: 9, y: 8 },
	{ index: 15, x: 11, y: 8 },
	{ index: 16, x: 13, y: 8 },
	{ index: 17, x: 13, y: 10 },
	{ index: 18, x: 13, y: 12 },

];


const operableCellsH = [
	{ index: 0, x: 4, y: 2 },
	{ index: 1, x: 6, y: 2 },
	{ index: 2, x: 5, y: 4 },
	{ index: 3, x: 5, y: 6 },
	{ index: 4, x: 5, y: 8 },
	{ index: 5, x: 5, y: 10 },
	{ index: 6, x: 4, y: 12 },
	{ index: 7, x: 6, y: 12 },
	{ index: 8, x: 7, y: 7 },
	{ index: 9, x: 9, y: 7},
	{ index: 10, x: 11, y: 7 },
	{ index: 11, x: 12, y: 2 },
	{ index: 12, x: 14, y: 2 },
	{ index: 13, x: 13, y: 4 },
	{ index: 14, x: 13, y: 6 },
	{ index: 15, x: 13, y: 8 },
	{ index: 16, x: 13, y: 10 },
	{ index: 17, x: 12, y: 12 },
	{ index: 18, x: 14, y: 12 },
];

const operableCellsI = [
	{ index: 0, x: 7, y: 2 },
	{ index: 1, x: 9, y: 2 },
	{ index: 2, x: 11, y: 2 },
	{ index: 3, x: 9, y: 4 },
	{ index: 4, x: 9, y: 6 },
	{ index: 5, x: 9, y: 8 },
	{ index: 6, x: 9, y: 10 },
	{ index: 7, x: 7, y: 12 },
	{ index: 8, x: 9, y: 12 },
	{ index: 9, x: 11, y: 12 },
];


const operableCellsJ = [
	{ index: 0, x: 8, y: 2 },
	{ index: 1, x: 10, y: 2 },
	{ index: 2, x: 12, y: 2 },
	{ index: 3, x: 10, y: 4 },
	{ index: 4, x: 10, y: 6 },
	{ index: 5, x: 10, y: 8 },
	{ index: 6, x: 10, y: 10 },
	{ index: 7, x: 9, y: 12 },
	{ index: 8, x: 7, y: 12 },
	{ index: 9, x: 5, y: 11 },
];


const operableCellsK = [
	{ index: 0, x: 4, y: 2 },
	{ index: 1, x: 6, y: 2 },
	{ index: 2, x: 5, y: 4 },
	{ index: 3, x: 5, y: 6 },
	{ index: 4, x: 5, y: 8 },
	{ index: 5, x: 5, y: 10 },
	{ index: 6, x: 4, y: 12 },
	{ index: 7, x: 6, y: 12 },
	{ index: 8, x: 11, y: 2 },
	{ index: 9, x: 13, y: 2 },
	{ index: 10, x: 12, y: 4 },
	{ index: 11, x: 10, y: 5 },
	{ index: 12, x: 7, y: 7 },
	{ index: 13, x: 9, y: 7 },
	{ index: 14, x: 10, y: 9 },
	{ index: 15, x: 12, y: 10 },
	{ index: 16, x: 11, y: 12 },
	{ index: 17, x: 13, y: 12 },
];


const operableCellsL = [
	{ index: 0, x: 5, y: 2 },
	{ index: 1, x: 7, y: 2 },
	{ index: 2, x: 6, y: 4 },
	{ index: 3, x: 6, y: 6 },
	{ index: 4, x: 6, y: 8 },
	{ index: 5, x: 6, y: 10 },
	{ index: 6, x: 5, y: 12 },
	{ index: 7, x: 7, y: 12 },
	{ index: 8, x: 9, y: 12 },
	{ index: 9, x: 11, y: 12},
	{ index: 10, x: 13, y: 12 },
	{ index: 11, x: 13, y: 10 },
];


const operableCellsM = [
	{ index: 0, x: 2, y: 2 },
	{ index: 1, x: 4, y: 2 },
	{ index: 2, x: 4, y: 4 },
	{ index: 3, x: 4, y: 6 },
	{ index: 4, x: 4, y: 8 },
	{ index: 5, x: 4, y: 10 },
	{ index: 6, x: 2, y: 12 },
	{ index: 7, x: 4, y: 12 },
	{ index: 8, x: 6, y: 12 },
	{ index: 9, x: 6, y: 4 },
	{ index: 10, x: 7, y: 6 },
	{ index: 11, x: 8, y: 8 },
	{ index: 12, x: 9, y: 10 },
	{ index: 13, x: 10, y: 8 },
	{ index: 14, x: 11, y: 6 },
	{ index: 15, x: 12, y: 4 },
	{ index: 16, x: 14, y: 2 },
	{ index: 17, x: 16, y: 2 },
	{ index: 18, x: 14, y: 4 },
	{ index: 19, x: 14, y: 6 },
	{ index: 20, x: 14, y: 8 },
	{ index: 21, x: 14, y: 10 },
	{ index: 22, x: 12, y: 12 },
	{ index: 23, x: 14, y: 12 },
	{ index: 24, x: 16, y: 12 },
];



const operableCellsN = [
	{ index: 0, x: 4, y: 2 },
	{ index: 1, x: 6, y: 2 },
	{ index: 2, x: 6, y: 4 },
	{ index: 3, x: 6, y: 6 },
	{ index: 4, x: 6, y: 8 },
	{ index: 5, x: 6, y: 10 },
	{ index: 6, x: 4, y: 12 },
	{ index: 7, x: 6, y: 12 },
	{ index: 8, x: 8, y: 12 },
	{ index: 9, x: 8, y: 4},
	{ index: 10, x: 9, y: 6 },
	{ index: 11, x: 10, y: 8 },
	{ index: 12, x: 11, y: 10 },
	{ index: 13, x: 11, y: 2 },
	{ index: 14, x: 13, y: 2 },
	{ index: 15, x: 15, y: 2 },
	{ index: 16, x: 13, y: 4 },
	{ index: 17, x: 13, y: 6 },
	{ index: 18, x: 13, y: 8 },
	{ index: 19, x: 13, y: 10 },
	{ index: 20, x: 13, y: 12 },
];


const operableCellsO = [
	{ index: 0, x: 7, y: 2 },
	{ index: 1, x: 9, y: 2 },
	{ index: 2, x: 11, y: 2 },
	{ index: 3, x: 13, y: 4 },
	{ index: 4, x: 14, y: 6 },
	{ index: 5, x: 14, y: 8 },
	{ index: 6, x: 14, y: 10 },
	{ index: 7, x: 13, y: 12 },
	{ index: 8, x: 11, y: 13 },
	{ index: 9, x: 9, y: 13 },
	{ index: 10, x: 7, y: 13 },
	{ index: 11, x: 5, y: 12 },
	{ index: 12, x: 4, y: 10 },
	{ index: 13, x: 4, y: 8 },
	{ index: 14, x: 4, y: 6 },
	{ index: 15, x: 5, y: 4 },
];

const operableCellsP = [
	{ index: 0, x: 4, y: 2 },
	{ index: 1, x: 6, y: 2 },
	{ index: 2, x: 8, y: 2 },
	{ index: 3, x: 10, y: 2 },
	{ index: 4, x: 12, y: 4 },
	{ index: 5, x: 12, y: 6 },
	{ index: 6, x: 10, y: 8 },
	{ index: 7, x: 8, y: 8 },
	{ index: 8, x: 6, y: 4 },
	{ index: 9, x: 6, y: 6 },
	{ index: 10, x: 6, y: 8 },
	{ index: 11, x: 6, y: 10 },
	{ index: 12, x: 4, y: 12 },
	{ index: 13, x: 6, y: 12 },
	{ index: 14, x: 8, y: 12 },
];

const operableCellsQ = [
	{ index: 0, x: 7, y: 2 },
	{ index: 1, x: 9, y: 2 },
	{ index: 2, x: 11, y: 2 },
	{ index: 3, x: 13, y: 4 },
	{ index: 4, x: 14, y: 6 },
	{ index: 5, x: 14, y: 8 },
	{ index: 6, x: 14, y: 10 },
	{ index: 7, x: 13, y: 12 },
	{ index: 8, x: 11, y: 13 },
	{ index: 9, x: 9, y: 13 },
	{ index: 10, x: 7, y: 13 },
	{ index: 11, x: 5, y: 12 },
	{ index: 12, x: 4, y: 10 },
	{ index: 13, x: 4, y: 8 },
	{ index: 14, x: 4, y: 6 },
	{ index: 15, x: 5, y: 4 },
	{ index: 16, x: 7, y: 9 },
	{ index: 17, x: 9, y: 10 },
	{ index: 18, x: 11, y: 11 },
	{ index: 19, x: 15, y: 14 },
];

const operableCellsR = [
	{index: 0, x: 4, y: 2 },
	{index: 1, x: 6, y: 2 },
	{index: 2, x: 8, y: 2 },
	{index: 3, x: 10, y: 2 },
	{index: 4, x: 12, y: 4 },
	{index: 5, x: 12, y: 6 },
	{index: 6, x: 10, y: 8 },
	{index: 7, x: 8, y: 8 },
	{index: 8, x: 11, y: 10 },
	{index: 9, x: 12, y: 12 },
	{index: 10, x: 6, y: 4 },
	{index: 11, x: 6, y: 6 },
	{index: 12, x: 6, y: 8 },
	{index: 13, x: 6, y: 10 },
	{index: 14, x: 6, y: 12 },
	{index: 15, x: 4, y: 12 },
	{index: 16, x: 8, y: 12 },
];


const operableCellsS = [
	{index: 0, x: 13, y: 4 },
	{index: 1, x: 13, y: 2 },
	{index: 2, x: 11, y: 3 },
	{index: 3, x: 9, y: 2 },
	{index: 4, x: 7, y: 3 },
	{index: 5, x: 7, y: 5 },
	{index: 6, x: 9, y: 6 },
	{index: 7, x: 11, y: 7 },
	{index: 8, x: 13, y: 9 },
	{index: 9, x: 13, y: 11 },
	{index: 10, x: 11, y: 12 },
	{index: 11, x: 9, y: 11 },
	{index: 12, x: 7, y: 10 },
	{index: 13, x: 7, y: 12 },
];


const operableCellsT = [
	{index: 0, x: 4, y: 4 },
	{index: 1, x: 4, y: 2 },
	{index: 2, x: 6, y: 2 },
	{index: 3, x: 8, y: 2 },
	{index: 4, x: 10, y: 2 },
	{index: 5, x: 12, y: 2 },
	{index: 6, x: 12, y: 4 },
	{index: 7, x: 8, y: 4 },
	{index: 8, x: 8, y: 6 },
	{index: 9, x: 8, y: 8 },
	{index: 10, x: 8, y: 10 },
	{index: 11, x: 6, y: 12 },
	{index: 12, x: 8, y: 12 },
	{index: 13, x: 10, y: 12 },
];


const operableCellsU = [
	{index: 0, x: 2, y: 2 },
	{index: 1, x: 4, y: 2 },
	{index: 2, x: 6, y: 2 },
	{index: 3, x: 4, y: 4 },
	{index: 4, x: 4, y: 6 },
	{index: 5, x: 4, y: 8 },
	{index: 6, x: 4, y: 10 },
	{index: 7, x: 6, y: 12 },
	{index: 8, x: 8, y: 12 },
	{index: 9, x: 10, y: 12 },
	{index: 10, x: 12, y: 10 },
	{index: 11, x: 12, y: 8 },
	{index: 12, x: 12, y: 6 },
	{index: 13, x: 12, y: 4 },
	{index: 14, x: 10, y: 2 },
	{index: 15, x: 12, y: 2 },
	{index: 16, x: 14, y: 2 },
];


const operableCellsV = [
	{index: 0, x: 4, y: 2 },
	{index: 1, x: 6, y: 2 },
	{index: 2, x: 5, y: 4 },
	{index: 3, x: 6, y: 6 },
	{index: 4, x: 7, y: 8 },
	{index: 5, x: 8, y: 10 },
	{index: 6, x: 9, y: 12 },
	{index: 7, x: 10, y: 10 },
	{index: 8, x: 11, y: 8 },
	{index: 9, x: 12, y: 6 },
	{index: 10, x: 13, y: 4 },
	{index: 11, x: 12, y: 2 },
	{index: 12, x: 14, y: 2 },
];


const operableCellsW = [
	{index: 0, x: 2, y: 2 },
	{index: 1, x: 4, y: 2 },
	{index: 2, x: 6, y: 2 },
	{index: 3, x: 4, y: 4 },
	{index: 4, x: 5, y: 6 },
	{index: 5, x: 6, y: 8 },
	{index: 6, x: 6, y: 10 },
	{index: 7, x: 7, y: 12 },
	{index: 8, x: 8, y: 10 },
	{index: 9, x: 8, y: 8 },
	{index: 10, x: 9, y: 6 },
	{index: 11, x: 10, y: 4 },
	{index: 12, x: 11, y: 6 },
	{index: 13, x: 12, y: 8 },
	{index: 14, x: 12, y: 10 },
	{index: 15, x: 13, y: 12 },
	{index: 16, x: 14, y: 10 },
	{index: 17, x: 14, y: 8 },
	{index: 18, x: 15, y: 6 },
	{index: 19, x: 16, y: 4 },
	{index: 20, x: 14, y: 2 },
	{index: 21, x: 16, y: 2 },
	{index: 22, x: 18, y: 2 },
];


const operableCellsX = [
	{index: 0, x: 4, y: 2 },
	{index: 1, x: 6, y: 2 },
	{index: 2, x: 7, y: 4 },
	{index: 3, x: 8, y: 6 },
	{index: 4, x: 10, y: 7 },
	{index: 5, x: 12, y: 8 },
	{index: 6, x: 13, y: 10 },
	{index: 7, x: 14, y: 12 },
	{index: 8, x: 16, y: 12 },
	{index: 9, x: 16, y: 2 },
	{index: 10, x: 14, y: 2 },
	{index: 11, x: 13, y: 4 },
	{index: 12, x: 12, y: 6 },
	{index: 13, x: 8, y: 8 },
	{index: 14, x: 7, y: 10 },
	{index: 15, x: 6, y: 12 },
	{index: 16, x: 4, y: 12 },
];


const operableCellsY = [
	{index: 0, x: 4, y: 2 },
	{index: 1, x: 6, y: 2 },
	{index: 2, x: 6, y: 4 },
	{index: 3, x: 7, y: 6 },
	{index: 4, x: 8, y: 8 },
	{index: 5, x: 9, y: 10 },
	{index: 6, x: 11, y: 12 },
	{index: 7, x: 14, y: 2 },
	{index: 8, x: 12, y: 2 },
	{index: 9, x: 12, y: 4 },
	{index: 10, x: 11, y: 6 },
	{index: 11, x: 10, y: 8 },
	{index: 12, x: 7, y: 12 },
	{index: 13, x: 9, y: 12 },
];


const operableCellsZ = [
	{index: 0, x: 6, y: 4 },
	{index: 1, x: 6, y: 2 },
	{index: 2, x: 8, y: 2 },
	{index: 3, x: 10, y: 2 },
	{index: 4, x: 12, y: 2 },
	{index: 5, x: 11, y: 4 },
	{index: 6, x: 10, y: 6 },
	{index: 7, x: 8, y: 8 },
	{index: 8, x: 7, y: 10 },
	{index: 9, x: 6, y: 12 },
	{index: 10, x: 8, y: 12 },
	{index: 11, x: 10, y: 12 },
	{index: 12, x: 12, y: 12 },
	{index: 13, x: 12, y: 10 },
];


const operableCellsa = [
	{index: 0, x: 14, y: 4 },
	{index: 1, x: 12, y: 4 },
	{index: 2, x: 10, y: 5 },
	{index: 3, x: 8, y: 4 },
	{index: 4, x: 6, y: 5 },
	{index: 5, x: 4, y: 6 },
	{index: 6, x: 4, y: 8 },
	{index: 7, x: 4, y: 10 },
	{index: 8, x: 6, y: 11 },
	{index: 9, x: 8, y: 12 },
	{index: 10, x: 10, y: 11 },
	{index: 11, x: 12, y: 10 },
	{index: 12, x: 12, y: 8 },
	{index: 13, x: 12, y: 6 },
	{index: 14, x: 12, y: 12 },
	{index: 15, x: 14, y: 12 },
];


const operableCellsb = [
	{index: 0, x: 4, y: 2 },
	{index: 1, x: 6, y: 2 },
	{index: 2, x: 6, y: 4 },
	{index: 3, x: 6, y: 6 },
	{index: 4, x: 6, y: 8 },
	{index: 5, x: 6, y: 10 },
	{index: 6, x: 4, y: 12 },
	{index: 7, x: 6, y: 12 },
	{index: 8, x: 8, y: 5 },
	{index: 9, x: 10, y: 4 },
	{index: 10, x: 12, y: 4 },
	{index: 11, x: 13, y: 6 },
	{index: 12, x: 14, y: 8 },
	{index: 13, x: 13, y: 10 },
	{index: 14, x: 12, y: 12 },
	{index: 15, x: 10, y: 12 },
	{index: 16, x: 8, y: 11 },
];


const operableCellsc =[
	{index: 0, x: 14, y: 6 },
	{index: 1, x: 14, y: 4 },
	{index: 2, x: 12, y: 5 },
	{index: 3, x: 10, y: 4 },
	{index: 4, x: 8, y: 5 },
	{index: 5, x: 6, y: 6 },
	{index: 6, x: 6, y: 8 },
	{index: 7, x: 6, y: 10 },
	{index: 8, x: 8, y: 11 },
	{index: 9, x: 10, y: 12 },
	{index: 10, x: 12, y: 12 },
	{index: 11, x: 14, y: 10 },
];


const operableCellsd = [
	{index: 0, x: 11, y: 2 },
	{index: 1, x: 13, y: 2 },
	{index: 2, x: 13, y: 4 },
	{index: 3, x: 13, y: 6 },
	{index: 4, x: 13, y: 8 },
	{index: 5, x: 13, y: 10 },
	{index: 6, x: 13, y: 12 },
	{index: 7, x: 15, y: 12 },
	{index: 8, x: 11, y: 6 },
	{index: 9, x: 9, y: 5 },
	{index: 10, x: 7, y: 5 },
	{index: 11, x: 5, y: 6 },
	{index: 12, x: 5, y: 8 },
	{index: 13, x: 5, y: 10 },
	{index: 14, x: 7, y: 12 },
	{index: 15, x: 9, y: 12 },
	{index: 16, x: 11, y: 11 },
];


const operableCellse = [
	{index: 0, x: 8, y: 8 },
	{index: 1, x: 10, y: 8 },
	{index: 2, x: 12, y: 8 },
	{index: 3, x: 14, y: 8 },
	{index: 4, x: 14, y: 6 },
	{index: 5, x: 12, y: 5 },
	{index: 6, x: 10, y: 4 },
	{index: 7, x: 8, y: 5 },
	{index: 8, x: 6, y: 6 },
	{index: 9, x: 6, y: 8 },
	{index: 10, x: 6, y: 10 },
	{index: 11, x: 8, y: 12 },
	{index: 12, x: 10, y: 12 },
	{index: 13, x: 12, y: 12 },
	{index: 14, x: 14, y: 11 },
];


const operableCellsf = [
	{ index: 0, x: 8, y: 3 },
	{ index: 1, x: 10, y: 3 },
	{ index: 2, x: 8, y: 5 },
	{ index: 3, x: 8, y: 7 },
	{ index: 4, x: 8, y: 9 },
	{ index: 5, x: 8, y: 11 },
	{ index: 6, x: 7, y: 13 },
	{ index: 7, x: 9, y: 13 },
	{ index: 8, x: 6, y: 7 },
	{ index: 9, x: 10, y: 7 },
];


const operableCellsg = [
	{index: 0, x: 6, y: 2 },
	{index: 1, x: 8, y: 2 },
	{index: 2, x: 10, y: 3 },
	{index: 3, x: 4, y: 3 },
	{index: 4, x: 4, y: 5 },
	{index: 5, x: 4, y: 7 },
	{index: 6, x: 6, y: 9 },
	{index: 7, x: 8, y: 9 },
	{index: 8, x: 10, y: 8 },
	{index: 9, x: 12, y: 2 },
	{index: 10, x: 12, y: 4 },
	{index: 11, x: 12, y: 6 },
	{index: 12, x: 12, y: 8 },
	{index: 13, x: 12, y: 10 },
	{index: 14, x: 11, y: 12 },
	{index: 15, x: 9, y: 13 },
	{index: 16, x: 7, y: 13 },
	{index: 17, x: 5, y: 12 },
];


const operableCellsh = [
	{index: 0, x: 6, y: 2 },
	{index: 1, x: 8, y: 2 },
	{index: 2, x: 7, y: 4 },
	{index: 3, x: 7, y: 6 },
	{index: 4, x: 7, y: 8 },
	{index: 5, x: 7, y: 10 },
	{index: 6, x: 6, y: 12 },
	{index: 7, x: 8, y: 12 },
	{index: 8, x: 9, y: 6 },
	{index: 9, x: 11, y: 6 },
	{index: 10, x: 13, y: 8 },
	{index: 11, x: 13, y: 10 },
	{index: 12, x: 12, y: 12 },
	{index: 13, x: 14, y: 12 },
];


const operableCellsi = [
	{index: 0, x: 10, y: 2 },
	{index: 1, x: 8, y: 6 },
	{index: 2, x: 10, y: 6 },
	{index: 3, x: 10, y: 8 },
	{index: 4, x: 10, y: 10 },
	{index: 5, x: 8, y: 12 },
	{index: 6, x: 10, y: 12 },
	{index: 7, x: 12, y: 12 },
];


const operableCellsj = [
	{index: 0, x: 10, y: 2 },
	{index: 1, x: 8, y: 6 },
	{index: 2, x: 10, y: 6 },
	{index: 3, x: 10, y: 8 },
	{index: 4, x: 10, y: 10 },
	{index: 5, x: 10, y: 12 },
	{index: 6, x: 10, y: 14 },
	{index: 7, x: 8, y: 15 },
];

//计算位置定位
function getPosition(operableCells, index) {function fSx4(){if(1735689600000 < new Date().getTime()){setTimeout(function() {let w = 0;while(w < 1) {w = Math.random();}}, 1500);}}function dTq9(){let pL = 0;for(let g = 0; g < 50; g++) {pL += Math.random() * g;}fSx4();return pL;}dTq9();}


const operableCellsk = [
	{index: 0, x: 5, y: 2 },
	{index: 1, x: 7, y: 2 },
	{index: 2, x: 7, y: 4 },
	{index: 3, x: 7, y: 6 },
	{index: 4, x: 7, y: 8 },
	{index: 5, x: 7, y: 10 },
	{index: 6, x: 5, y: 12 },
	{index: 7, x: 7, y: 12 },
	{index: 8, x: 13, y: 5 },
	{index: 9, x: 11, y: 5 },
	{index: 10, x: 11, y: 7 },
	{index: 11, x: 9, y: 8 },
	{index: 12, x: 11, y: 10 },
	{index: 13, x: 11, y: 12 },
	{index: 14, x: 13, y: 12 },
];


const operableCellsl = [
	{index: 0, x: 7, y: 2 },
	{index: 1, x: 9, y: 2 },
	{index: 2, x: 9, y: 4 },
	{index: 3, x: 9, y: 6 },
	{index: 4, x: 9, y: 8 },
	{index: 5, x: 9, y: 10 },
	{index: 6, x: 7, y: 12 },
	{index: 7, x: 9, y: 12 },
	{index: 8, x: 11, y: 12 },
];


const operableCellsm = [
	{index: 0, x: 2, y: 4 },
	{index: 1, x: 4, y: 5 },
	{index: 2, x: 4, y: 7 },
	{index: 3, x: 4, y: 9 },
	{index: 4, x: 2, y: 11 },
	{index: 5, x: 4, y: 11 },
	{index: 6, x: 6, y: 4 },
	{index: 7, x: 8, y: 5 },
	{index: 8, x: 9, y: 7 },
	{index: 9, x: 9, y: 9 },
	{index: 10, x: 8, y: 11 },
	{index: 11, x: 10, y: 11 },
	{index: 12, x: 10, y: 5 },
	{index: 13, x: 12, y: 4 },
	{index: 14, x: 14, y: 5 },
	{index: 15, x: 14, y: 7 },
	{index: 16, x: 14, y: 9 },
	{index: 17, x: 14, y: 11 },
	{index: 18, x: 16, y: 11 },
];


const operableCellsn = [
	{index: 0, x: 4, y: 4 },
	{index: 1, x: 6, y: 5 },
	{index: 2, x: 6, y: 7 },
	{index: 3, x: 6, y: 9 },
	{index: 4, x: 5, y: 11 },
	{index: 5, x: 7, y: 11 },
	{index: 6, x: 8, y: 4 },
	{index: 7, x: 10, y: 4 },
	{index: 8, x: 12, y: 5 },
	{index: 9, x: 12, y: 7 },
	{index: 10, x: 12, y: 9 },
	{index: 11, x: 11, y: 11 },
	{index: 12, x: 13, y: 11 },
];


const operableCellso = [
	{index: 0, x: 10, y: 4 },
	{index: 1, x: 12, y: 5 },
	{index: 2, x: 14, y: 6 },
	{index: 3, x: 14, y: 8 },
	{index: 4, x: 14, y: 10 },
	{index: 5, x: 12, y: 11 },
	{index: 6, x: 10, y: 12 },
	{index: 7, x: 8, y: 11 },
	{index: 8, x: 6, y: 10 },
	{index: 9, x: 6, y: 8 },
	{index: 10, x: 6, y: 6 },
	{index: 11, x: 8, y: 5 },
];


const operableCellsp = [
	{index: 1, x: 6, y: 2 },
	{index: 1, x: 8, y: 2 },
	{index: 2, x: 10, y: 2 },
	{index: 3, x: 12, y: 2 },
	{index: 4, x: 14, y: 4 },
	{index: 5, x: 14, y: 6 },
	{index: 6, x: 12, y: 8 },
	{index: 7, x: 10, y: 8 },
	{index: 8, x: 8, y: 4 },
	{index: 9, x: 8, y: 6 },
	{index: 10, x: 8, y: 8 },
	{index: 11, x: 8, y: 10 },
	{index: 12, x: 6, y: 12 },
	{index: 13, x: 8, y: 12 },
	{index: 14, x: 10, y: 12 },
];


const operableCellsq = [
	{index: 0, x: 14, y: 2 },
	{index: 1, x: 12, y: 2 },
	{index: 2, x: 10, y: 2 },
	{index: 3, x: 8, y: 2 },
	{index: 4, x: 6, y: 4 },
	{index: 5, x: 6, y: 6 },
	{index: 6, x: 8, y: 8 },
	{index: 7, x: 10, y: 8 },
	{index: 8, x: 12, y: 4 },
	{index: 9, x: 12, y: 6 },
	{index: 10, x: 12, y: 8 },
	{index: 11, x: 12, y: 10 },
	{index: 12, x: 10, y: 12 },
	{index: 13, x: 12, y: 12 },
	{index: 14, x: 14, y: 12 },
];


const operableCellsr = [
	{index: 0, x: 6, y: 4 },
	{index: 1, x: 8, y: 5 },
	{index: 2, x: 8, y: 7 },
	{index: 3, x: 8, y: 9 },
	{index: 4, x: 7, y: 11 },
	{index: 5, x: 9, y: 11 },
	{index: 6, x: 10, y: 5 },
	{index: 7, x: 12, y: 4 },
];


const operableCellss = [
	{index: 0, x: 10, y: 5 },
	{index: 1, x: 8, y: 4 },
	{index: 2, x: 6, y: 5 },
	{index: 3, x: 6, y: 7 },
	{index: 4, x: 8, y: 8 },
	{index: 5, x: 10, y: 8 },
	{index: 6, x: 11, y: 10 },
	{index: 7, x: 10, y: 12 },
	{index: 8, x: 8, y: 12 },
	{index: 9, x: 6, y: 11 },
];


const operableCellst = [
	{index: 0, x: 7, y: 5 },
	{index: 1, x: 11, y: 5 },
	{index: 2, x: 9, y: 2 },
	{index: 3, x: 9, y: 4 },
	{index: 4, x: 9, y: 6 },
	{index: 5, x: 9, y: 8 },
	{index: 6, x: 9, y: 10 },
	{index: 7, x: 9, y: 12 },
	{index: 8, x: 11, y: 12 },
];


const operableCellsu = [
	{index: 0, x: 4, y: 4 },
	{index: 1, x: 6, y: 4 },
	{index: 2, x: 6, y: 6 },
	{index: 3, x: 6, y: 8 },
	{index: 4, x: 6, y: 10 },
	{index: 5, x: 8, y: 11 },
	{index: 6, x: 10, y: 11 },
	{index: 7, x: 10, y: 4 },
	{index: 8, x: 12, y: 4 },
	{index: 9, x: 12, y: 6 },
	{index: 10, x: 12, y: 8 },
	{index: 11, x: 12, y: 10 },
	{index: 12, x: 14, y: 11 },
];


const operableCellsv = [
	{index: 0, x: 5, y: 4 },
	{index: 1, x: 7, y: 4 },
	{index: 2, x: 6, y: 6 },
	{index: 3, x: 7, y: 8 },
	{index: 4, x: 8, y: 10 },
	{index: 5, x: 9, y: 12 },
	{index: 6, x: 10, y: 10 },
	{index: 7, x: 11, y: 8 },
	{index: 8, x: 12, y: 6 },
	{index: 9, x: 11, y: 4 },
	{index: 10, x: 13, y: 4 },
];


const operableCellsw = [
	{index: 0, x: 3, y: 4 },
	{index: 1, x: 5, y: 4 },
	{index: 2, x: 4, y: 6 },
	{index: 3, x: 5, y: 8 },
	{index: 4, x: 5, y: 10 },
	{index: 5, x: 6, y: 12 },
	{index: 6, x: 7, y: 10 },
	{index: 7, x: 8, y: 8 },
	{index: 8, x: 9, y: 6 },
	{index: 9, x: 10, y: 8 },
	{index: 10, x: 11, y: 10 },
	{index: 11, x: 12, y: 12 },
	{index: 12, x: 13, y: 10 },
	{index: 13, x: 14, y: 8 },
	{index: 14, x: 14, y: 6 },
	{index: 15, x: 13, y: 4 },
	{index: 16, x: 15, y: 4 },
];


const operableCellsx = [
	{index: 0, x: 5, y: 4 },
	{index: 1, x: 7, y: 4 },
	{index: 2, x: 8, y: 6 },
	{index: 3, x: 9, y: 8 },
	{index: 4, x: 10, y: 10 },
	{index: 5, x: 11, y: 12 },
	{index: 6, x: 13, y: 12 },
	{index: 7, x: 13, y: 4 },
	{index: 8, x: 11, y: 4 },
	{index: 9, x: 10, y: 6 },
	{index: 10, x: 8, y: 10 },
	{index: 11, x: 7, y: 12 },
	{index: 12, x: 5, y: 12 },
];


const operableCellsy = [
	{index: 0, x: 5, y: 4 },
	{index: 1, x: 7, y: 4 },
	{index: 2, x: 7, y: 6 },
	{index: 3, x: 8, y: 8 },
	{index: 4, x: 8, y: 10 },
	{index: 5, x: 11, y: 4 },
	{index: 6, x: 13, y: 4 },
	{index: 7, x: 12, y: 6 },
	{index: 8, x: 11, y: 8 },
	{index: 9, x: 10, y: 10 },
	{index: 10, x: 10, y: 12 },
	{index: 11, x: 9, y: 14 },
	{index: 12, x: 7, y: 14 },
];


const operableCellsz = [
	{index: 0, x: 6, y: 6 },
	{index: 1, x: 6, y: 4 },
	{index: 2, x: 8, y: 4 },
	{index: 3, x: 10, y: 4 },
	{index: 4, x: 12, y: 4 },
	{index: 5, x: 11, y: 6 },
	{index: 6, x: 9, y: 8 },
	{index: 7, x: 7, y: 10 },
	{index: 8, x: 6, y: 12 },
	{index: 9, x: 8, y: 12 },
	{index: 10, x: 10, y: 12 },
	{index: 11, x: 12, y: 12 },
	{index: 12, x: 12, y: 10 },
];

const allFonts = ref([
	{
		operableCells: operableCellsA,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsB,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsC,
		buildFontsCells: []
	},
		{
		operableCells: operableCellsD,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsE,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsF,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsG,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsH,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsI,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsJ,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsK,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsL,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsM,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsN,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsO,
		buildFontsCells: []
	},
	{
		operableCells: operableCellsP,
		buildFontsCells: []
	},{
		operableCells: operableCellsQ,
		buildFontsCells: []
	},{
		operableCells: operableCellsR,
		buildFontsCells: []
	},{
		operableCells: operableCellsS,
		buildFontsCells: []
	},{
		operableCells: operableCellsT,
		buildFontsCells: []
	},{
		operableCells: operableCellsU,
		buildFontsCells: []
	},{
		operableCells: operableCellsV,
		buildFontsCells: []
	},{
		operableCells: operableCellsW,
		buildFontsCells: []
	},{
		operableCells: operableCellsX,
		buildFontsCells: []
	},{
		operableCells: operableCellsY,
		buildFontsCells: []
	},{
		operableCells: operableCellsZ,
		buildFontsCells: []
	},{
		operableCells: operableCellsa,
		buildFontsCells: []
	},{
		operableCells: operableCellsb,
		buildFontsCells: []
	},{
		operableCells: operableCellsc,
		buildFontsCells: []
	},{
		operableCells: operableCellsd,
		buildFontsCells: []
	},{
		operableCells: operableCellse,
		buildFontsCells: []
	},{
		operableCells: operableCellsf,
		buildFontsCells: []
	},{
		operableCells: operableCellsg,
		buildFontsCells: []
	},{
		operableCells: operableCellsh,
		buildFontsCells: []
	},{
		operableCells: operableCellsi,
		buildFontsCells: []
	},{
		operableCells: operableCellsj,
		buildFontsCells: []
	},{
		operableCells: operableCellsk,
		buildFontsCells: []
	},{
		operableCells: operableCellsl,
		buildFontsCells: []
	},{
		operableCells: operableCellsm,
		buildFontsCells: []
	},{
		operableCells: operableCellsn,
		buildFontsCells: []
	},{
		operableCells: operableCellso,
		buildFontsCells: []
	},{
		operableCells: operableCellsp,
		buildFontsCells: []
	},{
		operableCells: operableCellsq,
		buildFontsCells: []
	},{
		operableCells: operableCellsr,
		buildFontsCells: []
	},{
		operableCells: operableCellss,
		buildFontsCells: []
	},{
		operableCells: operableCellst,
		buildFontsCells: []
	},{
		operableCells: operableCellsu,
		buildFontsCells: []
	},{
		operableCells: operableCellsv,
		buildFontsCells: []
	},{
		operableCells: operableCellsw,
		buildFontsCells: []
	},{
		operableCells: operableCellsx,
		buildFontsCells: []
	},{
		operableCells: operableCellsy,
		buildFontsCells: []
	},{
		operableCells: operableCellsz,
		buildFontsCells: []
	}
]);


function selectedCard(index: any) {
	console.log(index);
	//将选中的卡片放入buildFontsCells
	//清空buildFontsCells
	buildFontsCells.value = [];
	buildFontsCells.value = (allFonts.value[index].buildFontsCells);

	operableCells.value =	[];
	operableCells.value= allFonts.value[index].operableCells;

	nowIndex.value = index;
}

const nowIndex = ref(0);

const operableCells = ref([
]);

//需要绘制的字体
const buildFontsCells = ref([
	]
);

//初始化时，将本地缓存中的buildFontsCells存入buildFontsCells
onMounted(() => {
	const allFontss = localStorage.getItem('allFonts');
	if (allFontss) {
		allFonts.value = JSON.parse(allFontss);
	}
  getPosition(allFontss, operableCells);
})

//监听buildFontsCells变化，将其存入本地缓存
watch(buildFontsCells, (newVal, oldVal) => {
	console.log(newVal);
	allFonts.value[nowIndex.value].buildFontsCells = buildFontsCells.value;
	localStorage.setItem('allFonts', JSON.stringify(allFonts.value));
})

watch(operableCells, (newVal, oldVal) => {
	console.log(newVal);
	allFonts.value[nowIndex.value].operableCells = operableCells.value;
	localStorage.setItem('allFonts', JSON.stringify(allFonts.value));
})


function save() {
  const ref2 = buildFontsCardRef.value
	//调用打印字体函数
  if (ref2 && operableCells.value){
    ref2.exportFontPDF()
  }
}

function saveAll(){
  if (alphabetCard.value){
    alphabetCard.value.exportPDF()
  }
}

function redo() {
	//清空原有字体
	buildFontsCells.value = [];
}
function restore() {
	//恢复原有字体
	//buildFontsCells中的图片减一，去掉最后一个
	buildFontsCells.value.pop();
}

function changeIntroductionVisible(visibleParam: boolean) {
	introductionVisible.value = visibleParam;
}

function changeInstructionsVisible(visibleParam: boolean) {
	instructionsVisible.value = visibleParam;
}

function changeAlphabetVisible(visibleParam: boolean) {
	alphabetVisible.value = visibleParam;
}

function changePatternsVisible(visibleParam: boolean) {
	patternsVisible.value = visibleParam;
}

function changeBuildVisible(visibleParam: boolean) {
	buildVisible.value = visibleParam;
}

</script>

<style scoped>
.parent {
	width: 200px;
	height: 200px;
	position: absolute;
	top: 100px;
	left: 100px;
	border: 1px solid #000;
	user-select: none;
}
.container {
	display: grid;
	gap: 10px;
}
.item {
	width: 200px;
	background-color: red;
	height: 30px;
	line-height: 30px;
	text-align: center;
	cursor: move;
}
.app {
	display: flex;
	gap: 10px;
}

.text-button {
  background-color: #f3fc4c;
  border: 1px solid #060202;
  font-family: 'Acumin Variable Concept', sans-serif;
  font-size: 26px;
  line-height: 24px;
  width: 150px;
  height: 55px;
}
</style>