import * as Point from '../../../utils/point.js'
import {SingleArrayGrid} from '../../../utils/grid.js'
export default class MovingGrid{
	/**@param {MovingGridDef} def*/
	constructor(def){
		this.size = Point.copy(def.grid.size);
		this.grid = new SingleArrayGrid(this.size.x);
		this.grid.grid = [...def.grid.elements];
		
		this.stateMachine = new CycleStateMachine(def.states);
		
		//initial position is final_state's goal position since it loops
		let final_state = def.states[def.states.length-1];
		this.initial_position = final_state.goal_position;
		this.position = Point.copy(this.initial_position);
	}

	update(dt){
		this.stateMachine.update(this, dt);
		
		let time_passed = this.stateMachine.time;
		let state_duration = this.stateMachine.state.duration;

		let goal_position = this.stateMachine.state.goal_position;
		let initial_position = this.initial_position;
		
		let distance_at_final_time = Point.sub(goal_position,initial_position);
		let distance_at_current_time = Point.scale(distance_at_final_time, time_passed/state_duration);
		
		let current_position = this.position;
		let next_position = Point.add(initial_position, distance_at_current_time);
		
		this.distance_moved_in_frame = Point.sub(next_position,current_position);
		this.position = next_position;
	}
}
/**
	@typedef {
		{	goal_position:	Point2d
		,	duration:	number
		}
	} MovingStateDef
*/
class CycleStateMachine{
	/**@param {MovingStateDef[]} states */
	constructor(states){
		this.index = 0;
		this.time = 0;
		this.state = states[0];
		this.states = states;
	}
	update(movingGrid, dt){
		this.time += dt;
		while(this.time >= this.state.duration){
			this.time -= this.state.duration;
			movingGrid.initial_position = this.state.goal_position;
			this.state = this.states[++this.index % this.states.length];
		}
	}
}