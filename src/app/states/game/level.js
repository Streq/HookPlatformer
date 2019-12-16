import { SingleArrayGrid } from "../../../utils/grid";

/** 
 * @param {PlayerDef} playerDef 
 * @returns {Player}
*/
const makePlayer = playerDef => (
	{	color:	playerDef.color
	,	position:
			{	x:	playerDef.position.x
			,	y:	playerDef.position.y
			}
	,	size:	{x:0.75, y:0.75}
	,	velocity:	{x:0, y:0}
	,	grounded:	false
	,	behaviour:
			{	change:	false
			,	jump:	false
			,	move: {x:0, y:0}
			}
	}
);

/** 
 * @param {Point2d} p 
 * @returns {Point2d}
*/
const copyPoint2d = p => ({x:p.x, y:p.y});
	
/** 
 * @param {Grid} g
 * @returns {SingleArrayGrid}
*/
const copyGrid = g => {
	let ret = new SingleArrayGrid(g.size.x);
	ret.grid = [...g.elements];
}


/** 
 * @param {LevelDef} levelDef 
 * @returns {World}
*/
export default function makeLevel(levelDef){
	/**@type {World} */
	let world = 
		{	player:	makePlayer(levelDef.spawn)
		,	time_since_start:	0
		,	static_grid:	copyGrid(levelDef.static_grid)
		,	size:	copyPoint2d(levelDef.static_grid.size)
		,	level_data: levelDef
		,	dynamic_grids: levelDef.dynamic_grids
		};


}