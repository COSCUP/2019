<template>
	<div id="schedule">
		<nav class="days">
			<template v-for="(day, index) in eventDay">
				<nuxt-link :key="index" :to="`/programs/day${index + 1}`" @click.native="(pickDay = day)" :class="{ 'active': day  === currentDay }">
				{{ `Day ${index + 1} (${day.month}/${day.date})` }}
				</nuxt-link>
			</template>
		</nav>
		<div
			id="timetable"
			:style="`--table: ${cssGridTemplateRows}; --list: ${cssListTemplateRow}; --length: ${rooms.length}; --areas: '${cssGridAreas}'`"
		>
			<ul id="rooms">
				<template v-for="(room, index) in rooms">
					<li :key="index">
						Room
						<strong>{{ room.name }}</strong>
					</li>
				</template>
			</ul>
			<ul id="programs">
				<template v-for="(start, index) in programStartTimeUnique">
					<li
						:key="`time-${index}`"
						class="time"
						:style="`grid-row-start: t${getTimeSlugWithoutColon(start)}`"
					>{{ getTimeSlug(start) }}</li>
				</template>

				<template v-for="(program, index) in todayPrograms">
					<li
						:key="`program-${index}`"
						class="program"
						:style="{
            '--room': `${program.room.id}`,
            '--start': `t${getTimeSlugWithoutColon(program.start)}`,
            '--end': `t${getTimeSlugWithoutColon(program.end)}`
          }"
					>
						<nuxt-link :to="`/programs/${program.id}`">
							<article>
								<footer>
									<span class="period">{{ `${getTimeSlug(program.start)} ~ ${getTimeSlug(program.end)}` }}</span>
									<span
										class="track"
										v-if="program.tags.length && program.tags[1]"
									>{{ `${program.tags[1].name}` }}</span>
									<header>
										<h4>{{ program.title }}</h4>
									</header>
									<span class="room">{{ program.room.name }}</span>
									<span class="length">{{ `${program.period} mins` }}</span>
									<span
										class="language"
										v-if="program.tags.length && program.tags[0]"
									>{{ `${program.tags[0].name}` }}</span>
								</footer>
							</article>
						</nuxt-link>
					</li>
				</template>
			</ul>
		</div>
		<nuxt-child :key="$route.params.id" :program="programs.find((program) => program.id === $route.params.id)" />
	</div>
</template>

<script lang="ts">
// packages
import { Component, Vue } from "nuxt-property-decorator";
import { namespace } from "vuex-class";

// stores
import { name as programsStoreName, DateTime, Program } from "~/store/programs";

const ProgramsState = namespace(programsStoreName).State;

@Component({
	name: "Programs",
})
class Programs extends Vue {
	@ProgramsState programs;
	@ProgramsState rooms;
	@ProgramsState tags;
	@ProgramsState types;
	@ProgramsState eventDay;
	pickDay: DateTime|null = null;

	mounted() {
		this.$store.dispatch("clientsFirstFetch", this.$options.fetch);
	}

	async fetch({ store: { dispatch } }) {
		await dispatch(`${programsStoreName}/fetchData`);
	}

	get currentDay(): DateTime {

		if (this.pickDay === null) {
			const today = new Date();

			const day = this.eventDay.find(
				(current: DateTime) =>
					current.year === today.getFullYear() &&
					current.month === today.getMonth() &&
					current.date === today.getDate()
			);

			return day !== undefined ? day : this.eventDay[0];
		} else {
			return this.pickDay;
		}
	}

	get todayPrograms(): Program[] {
		return this.programs.filter(
			(program: Program): boolean => {
				return program.start && program.end && program.room
					? program.start.date === this.currentDay.date
					: false;
			}
		).sort((a: Program, b: Program) => a.start.timestamp - b.start.timestamp);
	}

	get programTimeSlot(): DateTime[] {
		return this.todayPrograms.reduce(
			(carry: Array<DateTime>, cv: Program, index): Array<DateTime> => {
				carry.push(cv.start, cv.end);
				return carry;
			},
			[]
		);
	}

	get programStartTime(): DateTime[] {
		return this.programTimeSlot.filter(
			(current: DateTime, index: number, arr: DateTime[]) => index % 2 === 0
		);
	}

	get programStartTimeUnique(): DateTime[] {
		return this.programStartTime.filter(
			(current: DateTime, index: number, arr: DateTime[]) =>
				arr.findIndex(exists => exists.timestamp === current.timestamp) ===
				index
		);
	}

	get cssGridTemplateRows() {
		return this.programTimeSlot
			.filter(
				(v, i, a) =>
					a.findIndex(exists => exists.timestamp === v.timestamp) === i
			)
			.sort((a: DateTime, b: DateTime) => a.timestamp - b.timestamp)
			.map((time: DateTime) => {
				return `[t${this.getTimeSlugWithoutColon(time)}] minmax(1em, auto)`;
			})
			.join(" ");
	}

	get cssGridAreas() {
		return this.rooms.map(room => room.id).join(" ");
	}

	get cssListTemplateRow() {
		return this.programStartTime
			.sort((a: DateTime, b: DateTime) => a.timestamp - b.timestamp)
			.map((current: DateTime, index: number, arr: DateTime[]) =>
				index > 0 && current.timestamp === arr[index - 1].timestamp
					? "auto"
					: `[t${this.getTimeSlugWithoutColon(current)}] auto auto`
			)
			.join(" ");
	}

	getTimeSlug = (dateTime: DateTime): string => {
		const hours = this.padStartWithZero(dateTime.hour);
		const minutes = this.padStartWithZero(dateTime.minute);
		return `${hours}:${minutes}`;
	}

	getTimeSlugWithoutColon = (dateTime: DateTime): string => {
		const hours = this.padStartWithZero(dateTime.hour);
		const minutes = this.padStartWithZero(dateTime.minute);
		return `${hours}${minutes}`;
	}

	padStartWithZero(number) {
		return number < 10 ? `0${number}` : number.toString();
	}
}
export default Programs;
</script>

<style lang="stylus">
#schedule {
	width: auto;
}

.days {

	a {
		display: inline-block;
		text-decoration: none;
		border: none;
		line-height: auto;
		color: inherit;
	}

  .active {
        color: #009a79;
        border-bottom: 5px solid;
    }

	@media only screen and (max-width: 719px) {
		position: fixed;
		top: 0;
		width: 100%;
		background: #fff;
		display: flex;
		z-index: 999;

		a {
			height: 64px;
			flex: 1 0 auto;
			text-align: center;
			line-height: 64px;
		}
	}

	@media only screen and (min-width: 720px) {
		text-align: right;

		a {
			color: #b8d2cf;
			padding: 0.5em;
		}
	}

	@media only screen and (min-width: 1000px) {
		font-size: 3em;
		position: static;

		a {
			margin: 1em 0 0.5em;
		}
	}
}

#timetable {
}

#rooms {
	display: none;
	list-style: none;
	text-align: center;
	position: sticky;
	position: -webkit-sticky;
	top: 65px;
	contain: layout;
	background-color: rgba(255, 255, 255, 0.8);
	background-attachment: fixed;
	z-index: 9;
	margin: 0;

	li {
		flex: 1 0 calc(((100% - 7 * 0.5em) / 8));
		font-size: smaller;
		color: rgba(0, 0, 0, 0.4);

		&:not(:first-child) {
			margin-left: 0.5em;
		}
	}

	strong {
		display: block;
		font-size: 2em;
		margin: -0.3em 0 0.5em;
		color: rgba(0, 0, 0, 0.7);
	}

	@media only screen and (min-width: 1000px) {
		display: flex;
	}
}

.time {
	font-size: 20px;
	color: #009a79;
	background-color: #ecf5f4;
	padding: 0.5em;

	@supports (position: -webkit-sticky) {
		position: -webkit-sticky;
		top: 69px;
		z-index: 9;
	}

	@media only screen and (min-width: 720px) {
		position: sticky;
		margin: 0;
		padding: 0.5em 64px;
		border-top: 1px solid #b8d2cf;
		grid-column: 1 / span 2;
		top: 64px;
	}

	@media only screen and (min-width: 1000px) {
		display: none;
	}
}

#programs {
	list-style: none;
	display: grid;
	grid-template-rows: var(--list);

	li {
		a {
			display: block;
			height: 100%;
			contain: layout;
			color: inherit;
		}

		@media only screen and (min-width: 1000px) {
			position: relative;

			article {
				position: sticky;
				position: -webkit-sticky;
				top: 130px;
			}
		}
	}

	@media only screen and (max-width: 719px) {
		grid-template-columns: none;
	}

	@media only screen and (min-width: 720px) {
		grid-template-columns: 120px auto;
		grid-column: 2;
	}

	@media only screen and (min-width: 1000px) {
		grid-template-rows: var(--table);
		grid-template-areas: var(--areas);
		grid-column: var(--room);
		grid-gap: 0 0.5em;
		grid-template-columns: repeat(var(--length), calc(((100% - 7 * 0.5em) / 8)));
		margin: 0;
	}
}

.program {
	padding: 0.5em;

	h4 {
		line-height: 1.5rem;
		font-weight: normal;
		margin: 0;
		word-break: break-word;
		font-size: 16px;
	}

	.track {
		color: #009a79;
	}

	footer {
		position: relative;
	}

	.period {
		opacity: 0.8;
		display: none;
	}

	.length {
		&::before, &::after {
			content: ' - ';
		}
	}

	@media only screen and (max-width: 719px) {
		border-bottom: 1px solid #e9e9e9;
		padding: 1em;
	}

	@media only screen and (min-width: 720px) {
		grid-column: 2;
		margin-bottom: 1em;

		h4 {
			font-size: 24px;
		}
	}

	@media only screen and (min-width: 1000px) {
		grid-column: var(--room);
		grid-row-start: var(--start);
		grid-row-end: var(--end);
		border: 1px dashed rgba(0, 0, 0, 0.4);
		border-radius: 5px;
		margin-bottom: 0;

		h4 {
			font-size: large;
		}

		.period {
			display: block;
		}

		.track {
			font-size: smaller;
		}

		.length, .room, .language {
			display: none;
		}
	}
}
</style>
