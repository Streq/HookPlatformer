/**
	@typedef {
		{	x:	number
		,	y:	number
		}
	} Point2d

	@typedef {
		{	elements:	number[]
		,	size:		Point2d
		}
	} Grid

	@typedef {
		{	grid:	Grid
		,	states:	MovingStateDef[]
		}
	}MovingGridDef

	@typedef {
		{	spawn: PlayerDef
		,	static_grid:	Grid
		,	dynamic_grids:	Array<MovingGridDef>
		}
	} LevelDef


	@typedef {
		{	position:	Point2d
		,	size:		Point2d
		,	velocity:	Point2d
		,	grounded:	boolean
		,	color:		number
		,	behaviour:
			{	jump:		boolean
			,	change:		boolean
			,	move:		Point2d
			}
		}
	} Player

	@typedef {
		{	position:	Point2d
		,	color:		number
		}
	} PlayerDef

	@typedef {
		{	level_data: 		LevelDef
		,	player:				Player
		,	static_grid:		Grid
		,	dynamic_grids:		MovingColorGrid[]
		,	time_since_start:	number
		}
	} World
*/