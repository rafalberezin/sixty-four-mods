export {}

export type MAPPING_VERSION = '__VERSION__' // populated automatically from `package.json`
export type TARGET_GAME_VERSION = '1.2.1'

export type ArrayPoint = [number, number]
export type Point = { x: number; y: number }
export type ResourceArray = number[]
export type Color = string
export type ColorTriplet = [Color, Color, Color]
export type OnFinish = false | (() => void)

export interface Codex {
	resources: CodexResource[]
	entities: CodexEntities
	messages: CodexMessages
	achievements: CodexAchievement[]
	preload: string[]
}

export interface CodexResource {
	name: string
	sfx: string
	triplet: ColorTriplet
	surgeTriplet?: ColorTriplet
	chances?: (
		| { type: 0; base: number; mean: number; stdev: number }
		| { type: 1; base: number; from: number; to: number }
	)[]
	probabilities?: {
		point: number
		spread: number
		value: number
		span?: number
	}[]
	mean?: number
	stdev?: number
	base?: number
}

export interface CodexEntity<T extends Entity> {
	class: T
	price: ResourceArray
	priceExponent?: number
	canPurchase?: boolean
	onlyone?: boolean
	merge?: boolean
	affected?: EntityMarkers
	shouldUnlock?: (m: Game) => boolean
	isUpgradeTo?: CodexEntityNames
	isDark?: boolean
}

export interface CodexEntities {
	annihilator: CodexEntity<Annihilator>
	auxpump: CodexEntity<Auxpump>
	auxpump2: CodexEntity<Auxpump2>
	chasm: CodexEntity<Chasm>
	clicker1: CodexEntity<Clicker1>
	clicker2: CodexEntity<Clicker2>
	clicker3: CodexEntity<Clicker3>
	conductor: CodexEntity<Conductor>
	consumer: CodexEntity<Consumer>
	converter13: CodexEntity<Converter13>
	converter32: CodexEntity<Converter32>
	converter41: CodexEntity<Converter41>
	converter64: CodexEntity<Converter64>
	converter76: CodexEntity<Converter76>
	cookie: CodexEntity<Cookie>
	cube: CodexEntity<Cube>
	destabilizer: CodexEntity<Destabilizer>
	destabilizer2: CodexEntity<Destabilizer2>
	destabilizer2a: CodexEntity<Destabilizer2a>
	doublechannel: CodexEntity<Doublechannel>
	doublechannel2: CodexEntity<Doublechannel2>
	entropic: CodexEntity<Entropic>
	entropic2: CodexEntity<Entropic2>
	entropic2a: CodexEntity<Entropic2a>
	entropic3: CodexEntity<Entropic3>
	eye: CodexEntity<Eye>
	flower: CodexEntity<Flower>
	fruit: CodexEntity<Fruit>
	generaldecay: CodexEntity<Generaldecay>
	gradient: CodexEntity<Gradient>
	hollow: CodexEntity<Hollow>
	injector: CodexEntity<Injector>
	mega1: CodexEntity<Mega1>
	mega1a: CodexEntity<Mega1a>
	mega1b: CodexEntity<Mega1b>
	mega2: CodexEntity<Mega2>
	mega3: CodexEntity<Mega3>
	pinhole: CodexEntity<Pinhole>
	preheater: CodexEntity<Preheater>
	pump: CodexEntity<Pump>
	pump2: CodexEntity<Pump2>
	puncture: CodexEntity<Puncture>
	reflector: CodexEntity<Reflector>
	scan: CodexEntity<Scan>
	silo: CodexEntity<Silo>
	silo2: CodexEntity<Silo2>
	stabilizer: CodexEntity<Stabilizer>
	stabilizer2: CodexEntity<Stabilizer2>
	stabilizer3: CodexEntity<Stabilizer3>
	strange: CodexEntity<Strange>
	strange1: CodexEntity<Strange1>
	strange2: CodexEntity<Strange2>
	strange3: CodexEntity<Strange3>
	surge: CodexEntity<Surge>
	valve: CodexEntity<Valve>
	vault: CodexEntity<Vault>
	vessel: CodexEntity<Vessel>
	vessel2: CodexEntity<Vessel2>
	voidsculpture: CodexEntity<Voidsculpture>
	waypoint: CodexEntity<Waypoint>
	waypoint2: CodexEntity<Waypoint2>

	eraser: CodexEraserEntity
	eraser2: CodexEraserEntity
	eraser3: CodexEraserEntity
}

export interface CodexEraserEntity {
	price: ResourceArray
	canPurchase: boolean
	shouldUnlock: (m: Game) => boolean
}

export type CodexEntityNames = keyof CodexEntities

export type EntityMarkers = Partial<Record<CodexEntityNames, boolean>>

export interface CodexAchievement {
	steamid: string
	src: string
	condition: (m: Game) => boolean
}

export interface CodexMessages {
	origins: number[]
	events: CodexMessageEvent[]
}

export interface CodexMessageEvent {
	condition: (m: Game) => boolean
	chain: number[]
}

export interface VFXPayload {
	visibility?: number[]
}

export interface ExhaustVFXPayload extends VFXPayload {
	color?: Color
	uv?: ArrayPoint
}

export interface ResourceExplosionVFXPayload extends VFXPayload {
	resources: ResourceArray
	force?: number
	source?: ArrayPoint
}

export interface ResourceSparkVFXPayload extends VFXPayload {
	resources: ResourceArray
	source?: ArrayPoint
}

export interface ScannerMapVFXPayload extends VFXPayload {
	source: ArrayPoint
}

export interface ImpactVFXPayload extends VFXPayload {
	uv?: ArrayPoint
	color?: Color
}

export interface ResourceTransferVFXPayload extends VFXPayload {
	resources: ResourceArray
	force?: number
	source?: ArrayPoint
	destination?: ArrayPoint
	f?: OnFinish
	skip?: boolean
}

export interface ChasmTransferVFXPayload extends VFXPayload {
	resources: ResourceArray
	path: ArrayPoint[]
	f?: OnFinish
	skipIndex: number | false
}

export interface LightningVFXPayload extends VFXPayload {
	resources: ResourceArray
	color?: Color
	source?: ArrayPoint
	destination?: ArrayPoint
	f?: OnFinish
}

export interface DarkWaveVFXPayload extends VFXPayload {
	origin: ArrayPoint
	order: number
}

export interface GamePreload {
	steamId: string
	languageId: number | null
	save: string | false
	steamAchievements: number[]
	accumulatedPlayTime: number
	debug: string
}

export interface Save {
	backups: { timestamp: number; data: string }[]
	bridge: boolean
	eraserType: number
	existed: EntityMarkers
	glory: number[]
	hollowHardness: number
	messengerFiredEvents: boolean[]
	messengerShown: number
	messengerShownMessages: number[]
	needNoHelp: boolean
	onlyones: EntityMarkers
	plane: number
	resources: ResourceArray
	slowdown: {
		state: boolean
		timer: number
		totalTime: number
		multiplyer: number
		f: number
		cooldown: number
	}
	stats: {
		20: true
		totalResourcesMined: ResourceArray
		absoluteResourcesCount: number
		maxDepth: number
		timeEvents: number
		totalPlayTime: number
		totalPlayAndIdleTime: number
		totalCubeClicks: number
		machinesBuild: number
		machinesSold: number
		timesTeleported: number
		strangeRockPoked: number
		darkVisited: number
		timeSinceLastDelete: number
		excavatorWasBuilt: boolean
		gameIsFinished: boolean
	}
	stuff: {
		name: CodexEntityNames
		par: EntityParams
		position: ArrayPoint
	}[]
	switchedplanes: boolean
	timestamp: number
	unlockedEntities: EntityMarkers
	version: string
}

export interface EntityStringObject {
	name: CodexEntityNames
	position: ArrayPoint
	par: EntityParams
}

export type EntityParams = Partial<{
	depth: number
	timeStamp: number

	fill: number
	state: number
	conversion: number
	broken: number

	resources: ResourceArray
	resourceCount: number
	penalty: number

	spawnedHollows: number
	variant: number
	order: number
	soul: number
	timestamp: number

	grade: number
	type: number
	rayNumber: number
	colors: ColorTriplet
	maxLife: number
	life: number
	stabilizerPosition: ArrayPoint
}>

export interface SFX {
	source: AudioBufferSourceNode
	volume: GainNode
	pan: StereoPannerNode
	baseVolume: number
}

export interface SpriteArgs {
	master: Game
	src: string
	scale?: number
	frames: number[][]
	backframes: number[][]
	origins: number[] | number[][]
	sequences?: number[] | number[][]
	intervals: number | number[]
	mask?: number[]
}

export interface CubeMisc {
	pump: Pump
	resources: ResourceArray
}

export abstract class AbstractConverterEntity extends Entity {
	getConversionOutput(): ResourceArray
	harvest(): void
	refill(): void
	activate(): void
}

export interface SurgeArgs {
	resources: ResourceArray
	grade?: number
	rayNumber: number
	colors: ColorTriplet
	type: number
	life: number
	maxLife: number
}

export interface WaypointPar {
	timestamp: number
}

export interface ShopAddItemParams {
	isDark: boolean
	vessel: HTMLDivElement
	name: string
	description: string
	price: number
	priceExponent: number
	id: CodexEntityNames
}

export interface ShopItem {
	html: HTMLDivElement
	pack: HTMLDivElement | boolean
	priceHtml: HTMLDivElement
	price: number
	priceExponent: number
	name: CodexEntityNames
	counter: HTMLDivElement
	existed: HTMLDivElement
}

declare global {
	class Bezier {
		constructor(p: [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint])
		getXY(t: number): ArrayPoint
		getDXY(t: number): Point
		getDDXY(t: number): Point
		getNormal(t: number): Point
		getClosestPoint(x: number, y: number): { x: number; y: number; t: number }
		getCurvature(t: number): number
		getBoundingBox(): [number, number, number, number]
	}

	function abstract_getCodex(): Codex

	class VFX<T extends VFXPayload = VFXPayload> {
		constructor(master: Game, payload?: T)
		update(dt: number): void
		render(): void
	}

	class Exhaust extends VFX<ExhaustVFXPayload> {}
	class ResourceExplosion extends VFX<ResourceExplosionVFXPayload> {}
	class ResourceSpark extends VFX<ResourceSparkVFXPayload> {}
	class ScannerMap extends VFX<ScannerMapVFXPayload> {}
	class Impact extends VFX<ImpactVFXPayload> {}
	class ResourceTransfer extends VFX<ResourceTransferVFXPayload> {}
	class ChasmTransfer extends VFX<ChasmTransferVFXPayload> {
		getPointAtLength(l: number): ArrayPoint
	}
	class Lightning extends VFX<LightningVFXPayload> {}
	class DarkWave extends VFX<DarkWaveVFXPayload> {}

	class Game {
		constructor(canvas: HTMLCanvasElement, preload: GamePreload | null)

		init(
			_unused_canvas: HTMLCanvasElement | undefined,
			preload: GamePreload | null
		): Promise<void>
		initMobile(
			_unused_canvas: HTMLCanvasElement | undefined,
			preload: GamePreload | null
		): Promise<void>
		loadScripts(): Promise<void>

		// Critical modloader patches - MUST NOT load the default scripts
		// TL;DR: don't touch
		// loadScript(url: string, _unused_callback?: unknown): Promise<void>

		loadStyle(url: string): Promise<void>
		pronounce(...props: string[]): string
		getWordBranch(a: string[], en: boolean): string
		getResourceNodeValues(u: number, v: number): { rid: number; v: number }[]
		initAnalytics(): void
		togglePhotofobia(): void
		toggleChill(): void
		preloadImages(): Record<string, HTMLImageElement>
		showSteamWarning(): void
		initialLoad(save: string): void
		prepopulate(): void
		updateSteamAchievement(id: string, _unused_v?: unknown): void
		getMute(): boolean
		getLanguageId(): number | null
		changeLanguage(id: number): void
		initScreenSize(): void
		initScreenSizeMobile(): void
		watchCredits(): void
		closeCredits(): void
		switchPlane(p: number): void
		getAutonomy(): boolean
		initResources(): void
		setResourceHomes(): void
		setResourceHomesMobile(): void
		exportSave(): Promise<void>
		loadSaveFromClipboard(): Promise<void>
		importSave(data: string): void
		loadSave(manual?: Save): boolean
		simulateIdleTime(t: number): void
		restoreBackup(n: number): void
		backupLoop(): void
		saveLoop(): void
		saveGame(): void
		assembleSave(backupless: boolean): string | undefined
		decodeSave(s: string): Save
		encodeSave(s: string): string
		getEntityString(e: Entity): EntityStringObject | undefined
		addWaypoint(e: Waypoint): void
		removeWaypoint(e: Waypoint): void
		useWaypoint(e: Waypoint): void
		cleanup(): void
		mute(on: boolean): void
		updateEraserType(t: number): void
		initGlWithShader(): void
		getLoudnessFromXY(xy: ArrayPoint): number
		getPanValueFromX(x: number): number
		pickupItem(name: CodexEntityNames): void
		requestResources(
			r: ResourceArray,
			d: ArrayPoint,
			f?: OnFinish,
			skip?: boolean
		): boolean
		askForResources(
			r: ResourceArray,
			d: ArrayPoint,
			f?: OnFinish,
			skip?: boolean
		): boolean
		updateGlobalSounds(): void
		updateGlobalVolume(v?: number): void
		fadeSound(v: number): void
		initAudio(): void
		playMusic(name: string): void
		startSound(id: string, panning?: number, loudness?: number): SFX | false
		stopSound(sfx?: SFX, t?: number): void
		setLoudnessToSFX(sfx: SFX | undefined, l: number): void
		setPanToSFX(sfx: SFX | undefined, p: number): void
		playSound(
			id: string,
			panning: number | undefined,
			loudness: number | undefined,
			dark: boolean,
			forced: boolean
		): void
		getRealPrice(name: CodexEntityNames, scale: boolean): number
		canAffort(name: CodexEntityNames): boolean
		clearCell(uv: ArrayPoint): void
		updateMouseData(x: number, y: number): void
		processMousemove2(xy: ArrayPoint, dxy: ArrayPoint, click: number): void
		processTouchDown(): void
		shouldBeFilled(entity: Entity): boolean
		processDown(rightclick: boolean): void
		processQ(): void
		processE(): void
		canRelocate(e: Entity): boolean
		relocate(e: Entity, p: ArrayPoint): void
		processClick(): void
		processTouchUp(): void
		processMouseup(): void
		processMouseout(): void
		zoomInOut(delta: number): void
		doOnBlur(): void
		doOnFocus(): void
		toggleSplash(): void
		canEraseNow(): boolean
		setListenersTouch(): void
		setListeners(): void
		getHitCoordinates(xy: ArrayPoint): ArrayPoint
		checkHitBox(uv: ArrayPoint, hb: [number, number, number, number]): boolean
		updateAnalytics(dt: number): void
		updateLoop(): void
		updateCycle(span?: number, silent?: boolean): boolean
		updateMusic(dt: number): void
		updateAutoClicker(dt: number): void
		updateGamepad(dt: number): void
		measureRates(): void
		updateSlowdownEvent(): void
		updateResourceInteractions(dt: number): void
		updateResourcePops(dt: number): void
		updateTranslation(dt: number): void
		renderloop(): void
		renderSlowdown(): void
		renderHoveredCell(): void
		renderSOI(entity: Entity): void
		renderAffected(name: CodexEntityNames): void
		renderCursor(): void
		removeHint(): void
		renderUnfilled(): void
		getColorWave(
			rgb1?: [number, number, number, number],
			rgb2?: [number, number, number, number]
		): string
		renderActions(): void
		renderAvailability(): void
		renderResources(): void
		renderResourceBeds(): void
		renderDarkResources(): void
		makeReadable(n: number): string
		makeReadableFloor(n: number): string
		addResourcesFromArray(a: ResourceArray, skipAnalytics?: boolean): void
		substractResourcesFromArray(a: ResourceArray, skipAnalytics?: boolean): void
		isVisible(p: ArrayPoint): boolean
		renderConductors(dt: number): void
		renderEntities(dt: number): void
		updateUnfilled(): void
		updateEntities(dt: number): void
		renderGrid(): void
		drawResourceInScreenCoordinates(id: number, p: ArrayPoint): void
		drawBeam(uv?: ArrayPoint, c?: Color): void
		drawCube(position: ArrayPoint, size: number, triplet: ColorTriplet): void
		drawPrism(
			position: ArrayPoint,
			size: number,
			height: number,
			triplet: ColorTriplet
		): void
		uvToXY(uv: ArrayPoint): ArrayPoint
		uvToXYUntranslated(uv: ArrayPoint): ArrayPoint
		xyToUV(uv: ArrayPoint): ArrayPoint
		xyToUVUntranslated(uv: ArrayPoint): ArrayPoint
		entityAtCoordinates(p: ArrayPoint): Entity
		addEntity(
			name: CodexEntityNames,
			position: ArrayPoint,
			misc: EntityParams,
			options?: { skipShopUpdate?: boolean }
		): void
		renderVFX(): void
		renderChasmVFX(): void
		renderChasm(): void
		updateVFX(dt: number): void
		createResourceTransfer(
			r: ResourceArray,
			p?: ArrayPoint,
			d?: ArrayPoint,
			f?: OnFinish,
			v?: number[],
			skip?: boolean
		): void
		createChasmTransfer(
			r: ResourceArray,
			path: ArrayPoint[],
			f?: OnFinish,
			v?: number[],
			skipIndex?: boolean | number
		): void
		createLightning(
			r: ResourceArray,
			p?: ArrayPoint,
			d?: ArrayPoint,
			f?: OnFinish,
			v?: number[],
			c?: Color
		): void
		createResourceExplosion(
			r: ResourceArray,
			p?: ArrayPoint,
			v?: number[]
		): void
		createResourceSpark(c: ResourceArray, p?: ArrayPoint, v?: number[]): void
		createScan(p: ArrayPoint): void
		createExhaust(uv?: ArrayPoint, c?: Color, v?: number[]): void
		createImpact(uv?: ArrayPoint, c?: Color, v?: number[]): void
		createHollowEvent(
			color?: Color,
			time?: number,
			sound?: boolean,
			image?: boolean
		): void
		createDarkHollowEvent(
			color?: Color,
			time?: number,
			sound?: boolean,
			image?: boolean
		): void
		updateHollowEvents(dt: number): void
		renderHollowEvents(): void
		renderDarkHollowEvents(): void
		initiateSlowdown(t: number, m: number): void
		updateSurge(dt: number): void
		spawnSurge(): void
	}

	class Sprite {
		constructor(args: SpriteArgs)

		switchSequence(n: number): void
		update(dt: number): void
		render(uv: ArrayPoint, dt: number, back?: boolean, scaleMult?: number): void
		renderWithOverlay(
			uv: ArrayPoint,
			dt: number,
			back: boolean | undefined,
			scaleMult: number | undefined,
			c: Color
		): void
		renderState(
			uv: ArrayPoint,
			f: number,
			back: boolean,
			scaleMult?: number
		): void
		renderStateWithOverlay(
			uv: ArrayPoint,
			f: number,
			back: boolean,
			scaleMult: number | undefined,
			c: Color
		): void
		renderXY(
			xy: ArrayPoint,
			dt: number,
			back: boolean,
			forced_scale: number
		): void
	}

	class Entity {
		constructor(master: Game)

		init(): void

		update(dt: number): void
		updateSoul(dt: number): void

		render(dt: number, vposition?: ArrayPoint): void
		renderColored(dt: number, vposition?: ArrayPoint, c?: Color): void
		darkrender(dt: number, vposition: ArrayPoint): void
		// not a mistake
		rdarkenderColored(dt: number, vposition?: ArrayPoint, c?: Color): void

		initHint(): void
		initSellHint(): void
		getHint(): Cloud | false
		getDarkHint(): Cloud | false
		getSellHint(): Cloud | false

		onmousedown(eventOrPower?: Event | number): void
		onmouseup(): void
		onDelete(): void
		ondarkhover(order?: number): void

		shootExhaust(): void
		canHit(): boolean
		canDarkHit(): boolean
		setPosition(uv: ArrayPoint): this
		getNeighbours(): Entity[]
		isConnected(): boolean
	}

	class Annihilator extends Entity {
		tap(): boolean
		refill(): void
		activate(): void
	}

	class Auxpump extends Entity {
		tap(dt: number): void
		refill(): void
		activate(): void
	}
	class Auxpump2 extends Auxpump {}

	class Chasm extends Entity {
		updateChain(): void
	}

	class Clicker1 extends Entity {}
	class Clicker2 extends Clicker1 {}
	class Clicker3 extends Clicker1 {}

	class Conductor extends Entity {}

	class Consumer extends Entity {
		consume(r: ResourceArray, o: ArrayPoint): void
		release(): void
		refill(): void
		activate(): void
	}

	class Converter13 extends AbstractConverterEntity {}
	class Converter32 extends AbstractConverterEntity {}
	class Converter41 extends AbstractConverterEntity {}
	class Converter64 extends AbstractConverterEntity {}
	class Converter76 extends AbstractConverterEntity {}

	class Cookie extends Entity {}

	class Cube extends Entity {
		constructor(master: Game, misc: CubeMisc)
		swapRandomResource(cell: Injector, swapResourceId: number): void
		drawResources(): void
		accept(q: number): boolean
		onmousedown(power?: number): void
	}

	class Destabilizer extends Entity {
		tap(mult: number): void
		refill(): void
		activate(): void
	}
	class Destabilizer2 extends Destabilizer {}
	class Destabilizer2a extends Destabilizer {}

	class Doublechannel extends Entity {}
	class Doublechannel2 extends Doublechannel {}

	class Entropic extends Entity {
		tap(): void
		refill(): void
		activate(): void
	}
	class Entropic2 extends Entropic {}
	class Entropic2a extends Entropic {}
	class Entropic3 extends Entity {
		tap(): void
		refill(): void
		activate(): void
		process(): void
	}

	class Eye extends Entity {}

	class Flower extends Entity {
		constructor(master: Game, _unused_owner?: unknown)
		getOwner(): boolean | Strange1
	}
	class Fruit extends Flower {
		seed(): boolean
		getResourceFromFraction(f: number): ResourceArray
	}

	class Generaldecay extends Entity {
		consume(r: ResourceArray): void
	}

	class Gradient extends Entity {
		getDiscrete(mult: number): ResourceArray
		tap(power: number): void
	}

	class Hollow extends Entity {
		constructor(master: Game, _unused_owner?: unknown)
		getOwner(): boolean | Strange1
	}

	class Injector extends Entity {
		tap(mult: number): void
		refill(): void
		activate(): void
	}

	class Mega1 extends Entity {}
	class Mega1a extends Entity {}
	class Mega1b extends Entity {}
	class Mega2 extends Entity {}
	class Mega3 extends Entity {}

	class Pinhole extends Entity {}

	class Preheater extends Entity {
		tap(): void
		refill(): void
		activate(): void
	}

	class Pump extends Entity {
		boost(): void
		getProbability(
			point?: number,
			spread?: number,
			value?: number,
			span?: number
		): number
		getResource(): number
		checkForModifiers(): void
		pumpTo(c: Cube, q: number): void
	}
	class Pump2 extends Pump {}

	class Puncture extends Entity {
		constructor(master: Game, _unused_owner?: unknown)
		generateTentacles(): void
		ondarkmousedown(): void
	}

	class Reflector extends Entity {}

	class Scan extends Entity {
		constructor(master: Game, _unused_owner?: unknown)
	}

	class Silo extends Entity {
		tap(): void
		refill(): boolean
		activate(): void
	}
	class Silo2 extends Silo {}

	class Stabilizer extends Entity {
		initSurgePower(): void
	}
	class Stabilizer2 extends Stabilizer {}
	class Stabilizer3 extends Stabilizer {}

	class Strange extends Entity {}
	class Strange1 extends Entity {
		spawnHollow(): void
	}
	class Strange2 extends Strange1 {}
	class Strange3 extends Strange2 {}

	class Surge extends Entity {
		constructor(master: Game, args: SurgeArgs)
	}

	class Valve extends Entity {
		tap(dt: number): void
		refill(): void
		activate(): void
	}

	class Vault extends Entity {
		tap(): void
	}

	class Vessel extends Entity {
		tap(dt: number): void
		refill(): void
		activate(): void
	}
	class Vessel2 extends Vessel {}

	class Voidsculpture extends Entity {
		ondarkmousedown(): void
	}

	class Waypoint extends Entity {
		constructor(master: Game, par?: WaypointPar)
	}
	class Waypoint2 extends Waypoint {}

	class Achiever {
		constructor(master: Game)

		fireAchievement(id: number): void
		sneakAchievement(id: number): void
		setState(achievedList?: boolean[]): void
		update(_unused_dt?: number): void
	}

	class Messenger {
		constructor(master: Game)

		hideMessages(): void
		showMessages(): void
		update(dt: number): void
		setState(fired?: boolean[], list?: number[], shown?: number): void
		initChain(chain?: number[]): void
	}

	class Splash {
		constructor(master: Game)

		fireNotification(
			t: string,
			el: HTMLDivElement | undefined,
			up: boolean,
			leftFlag: boolean,
			time?: number
		): void
		selectItem(): void
		selectPreviousItem(): void
		selectNextItem(): void
		deselectItem(): void
		setPhotofobia(v: boolean): void
		show(): void
		close(): void
		updateMute(mute: boolean): void
		initMobile(_unused_o?: unknown): void
		init(o?: { selected: boolean; selectedId: number }): void
		updateBackups(): void
		updateGlory(): void
	}

	class Cloud {
		constructor(master: Game)

		setDarkMode(): void
		addName(name: string): void
		addDynamicText(check?: () => string | number | boolean): void
		addDescription(d: string): void
		addQEString(
			q: boolean,
			e: boolean,
			entity: Entity
		): [HTMLDivElement | undefined, HTMLDivElement | undefined] | undefined
		addLine(_unused_d?: string): void
		addProgress(check?: () => string | number | boolean): void
		addGradeAndProgress(
			grade: number,
			type: number,
			check?: () => string | number | boolean
		): void
		addResourceList(r: ResourceArray): void
		addResourcePercentageList(r: ResourceArray): void
		addConvertersOutput(r: ResourceArray, f?: () => boolean): void
		addSellIcon(): void
		addRefundList(name: CodexEntityNames): void
		update(): void
	}

	class Shop {
		constructor(container: HTMLDivElement, master: Game)

		updateMobileMenuState(): void
		toggleMobileEraser(): void
		toggleMobileRelocator(): void
		centerItem(name: string): void
		selectItem(): void
		selectNextItem(): void
		selectPreviousItem(): void
		deselectItem(): void
		setExisted(v: EntityMarkers): void
		init(dark: boolean): void
		switchPlane(p: number): void
		checkLoop(): void
		check(): void
		addItem(params: ShopAddItemParams): void
		updateElements(): void
		updateExisted(item: ShopItem): boolean
		updatePrice(item: ShopItem): void
		updateCounter(item: ShopItem): void
	}

	class Explainer {
		constructor(master: Game, next?: number)
		update(dt: number): void
	}
}

export interface PatchableClassMap {
	Bezier: typeof Bezier

	VFX: typeof VFX
	Exhaust: typeof Exhaust
	ResourceExplosion: typeof ResourceExplosion
	ResourceSpark: typeof ResourceSpark
	ScannerMap: typeof ScannerMap
	Impact: typeof Impact
	ResourceTransfer: typeof ResourceTransfer
	ChasmTransfer: typeof ChasmTransfer
	Lightning: typeof Lightning
	DarkWave: typeof DarkWave

	Game: typeof Game
	Sprite: typeof Sprite

	Entity: typeof Entity
	Strange: typeof Strange
	Strange1: typeof Strange1
	Strange2: typeof Strange2
	Strange3: typeof Strange3
	Vault: typeof Vault
	Doublechannel: typeof Doublechannel
	Consumer: typeof Consumer
	Preheater: typeof Preheater
	Doublechannel2: typeof Doublechannel2
	Auxpump: typeof Auxpump
	Auxpump2: typeof Auxpump2
	Valve: typeof Valve
	Injector: typeof Injector
	Entropic: typeof Entropic
	Entropic2: typeof Entropic2
	Entropic2a: typeof Entropic2a
	Entropic3: typeof Entropic3
	Destabilizer: typeof Destabilizer
	Destabilizer2: typeof Destabilizer2
	Destabilizer2a: typeof Destabilizer2a
	Converter32: typeof Converter32
	Converter13: typeof Converter13
	Converter41: typeof Converter41
	Converter76: typeof Converter76
	Converter64: typeof Converter64
	Reflector: typeof Reflector
	Generaldecay: typeof Generaldecay
	Cube: typeof Cube
	Pump: typeof Pump
	Pump2: typeof Pump2
	Mega1: typeof Mega1
	Mega1a: typeof Mega1a
	Mega1b: typeof Mega1b
	Mega2: typeof Mega2
	Mega3: typeof Mega3
	Eye: typeof Eye
	Clicker1: typeof Clicker1
	Clicker2: typeof Clicker2
	Clicker3: typeof Clicker3
	Cookie: typeof Cookie
	Pinhole: typeof Pinhole
	Gradient: typeof Gradient
	Chasm: typeof Chasm
	Conductor: typeof Conductor
	Voidsculpture: typeof Voidsculpture
	Hollow: typeof Hollow
	Flower: typeof Flower
	Fruit: typeof Fruit
	Vessel: typeof Vessel
	Vessel2: typeof Vessel2
	Silo: typeof Silo
	Silo2: typeof Silo2
	Waypoint: typeof Waypoint
	Waypoint2: typeof Waypoint2
	Annihilator: typeof Annihilator
	Surge: typeof Surge
	Stabilizer: typeof Stabilizer
	Stabilizer2: typeof Stabilizer2
	Stabilizer3: typeof Stabilizer3
	Scan: typeof Scan
	Puncture: typeof Puncture

	Achiever: typeof Achiever
	Messenger: typeof Messenger
	Splash: typeof Splash
	Cloud: typeof Cloud
	Shop: typeof Shop
	Explainer: typeof Explainer
}

// globally expose exported types needed by `modloader.d.ts` of the modloader package
declare global {
	type __Codex__ = Codex
	type __PatchableClassMap__ = PatchableClassMap
}
