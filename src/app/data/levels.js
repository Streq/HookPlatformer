export default 
	[	{	spawn:
			{	position:	
				{	x:	2
				,	y:	2
				}
			,	color:	2
			}
		,	static_grid: 
			{	size:	
				{	x:	10
				,	y:	10
				}
			,	grid:
				[	1,	2,	2,	2,	2,	2,	2,	2,	2,	5
				,	1,	2,	1,	1,	3,	4,	4,	4,	4,	4
				,	1,	2,	1,	1,	1,	2,	1,	2,	1,	2
				,	1,	2,	2,	2,	2,	2,	2,	2,	2,	2
				,	1,	2,	7,	2,	1,	1,	1,	1,	1,	2
				,	1,	1,	1,	1,	1,	2,	3,	2,	1,	2
				,	1,	1,	2,	4,	4,	2,	3,	2,	1,	2
				,	6,	1,	4,	6,	1,	2,	3,	2,	1,	2
				,	2,	1,	1,	2,	2,	2,	2,	2,	3,	2
				,	2,	6,	1,	2,	6,	3,	1,	1,	2,	2
				]
			}
		}
	,	{	spawn:
			{	position:	
				{	x:	2
				,	y:	8
				}
			,	color:	2
			}
		,	static_grid: 
			{	size:
				{	x:	10
				,	y:	10
				}
			,	grid:
				[	7,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	2,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	2,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	2,	1,	1,	1,	1,	1,	1
				,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2
				,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2
				,	2,	2,	2,	2,	2,	2,	2,	2,	2,	2
				,	2,	2,	2,	2,	2,	2,	2,	2,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	2
				,	1,	1,	1,	1,	1,	1,	1,	1,	2,	2
				]
			}
		,	dynamic_grids: 
			[	{	grid: 
					{	size:	
						{	x:	1
						,	y:	3
						}
					,	elements:
						[	1
						,	0
						,	1
						]
					}
				,	states: 
					[	{	goal_position: 
							{	x:	0
							,	y:	4
							}
						,	duration:	3
						}
					,	{	goal_position:
							{	x:	9
							,	y:	4
							}
						,	duration:	3
						}
					]
				}
			,	{	grid: 
					{	size:	
						{	x:	3
						,	y:	1
						}
					,	elements:
						[	1,	1,	1
						]
					}
				,	states:
					[	{	goal_position:
							{	x:	7
							,	y:	5
							}
						,	duration:	3
						}
					,	{	goal_position:
							{	x:	0
							,	y:	5
							}
						,	duration:	3
						}
					]
				}
			]
		}
	,	{	spawn:
			{	position:	
				{	x:	2
				,	y:	19
				}
			,	color:	2
			}
		,	static_grid: 
			{	size:
				{	x:	10
				,	y:	20
				}
			,	grid:
				[	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1
				]
			}
		,	dynamic_grids: 
			[	{	grid: 
					{	size:	
						{	x:	1
						,	y:	4
						}
					,	elements:
						[	2
						,	2
						,	2
						,	2
						]
					}
				,	states: 
					[	{	goal_position: 
							{	x:	4
							,	y:	16
							}
						,	duration:	5
						}
					,	{	goal_position:
							{	x:	4
							,	y:	0
							}
						,	duration:	Infinity
						}
					]
				}
			,	{	grid: 
					{	size:	
						{	x:	3
						,	y:	2
						}
					,	elements:
						[	3,	3,	0
						,	0,	3,	3
						]
					}
				,	states:
					[	{	goal_position:
							{	x:	8
							,	y:	18
							}
						,	duration:	5
						}
					,	{	goal_position:
							{	x:	8
							,	y:	0
							}
						,	duration:	Infinity
						}
					]
				}
			]
		}
	]