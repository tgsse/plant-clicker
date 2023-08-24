const maxStage = 3

class Plant {
	constructor(id) {
		this.id = id
		this.stages = [...Array(4)].map((_, i) => {
			return `${id}-stage-${i}.jpg`	
		})
		this.createdOn = Date.now()
	}

	name = ""

	counter = 0
	stage = 0
	maxStage = maxStage
}

Plant.prototype.getImage = function() {
	return this.stages[this.stage]
}