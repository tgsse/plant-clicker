(function() {

	// Constants

	const imagesDir = "assets/images/"

	// Utility

	function $(id) {
		return document.getElementById(id)
	}

	const viewUtils = {
		buildPlantImage: (plant, onClick) => {
			const img = document.createElement("img")
			img.src = `${imagesDir}${plant.getImage()}`
			img.alt = "plant"
			img.style.cursor = "pointer"
			img.addEventListener("click", event => onClick(event, plant))
			return img
		},
	}

	// App

	const view = {
		updatePlantCard: (plant) => {
			view.updatePlantName(plant.name)
			view.updateCounter(plant.counter)
			view.updateImage(plant)
		},

		updatePlantName: (value) => {
			$("name").innerText = value
		},

		updateCounter: (value) => {
			$("counter").innerText = value
		},

		updateImage: (plant) => {
			$("plantImageContainer").replaceChildren(viewUtils.buildPlantImage(plant, event => view.onPlantClick(event, plant)))
		},

		showPlantCollection: (plants) => {
			const plantCollection = plants.map(plant => {
				return viewUtils.buildPlantImage(plant, (_) => {
					controller.state.selectedPlantId = plant.id
					view.updatePlantCard(plant)
				})
			})
			$("plantCollectionContainer").replaceChildren(...plantCollection)
		},

		onPlantClick: (event, plant) => {
			if (plant.stage < plant.maxStage && ++plant.counter >= plant.stage * 3 + 3) {
				controller.evolvePlant(plant)
				view.updatePlantCard(plant)
			}
			view.updateCounter(plant.counter)
		},
	}

	const model = {
		plants: [
			new Plant("plant1"),
			new Plant("plant2"),
		],
	}

	const controller = {
		state: {
			selectedPlantId: undefined,
		},

		init: () => {
			view.showPlantCollection(model.plants)
		},

		evolvePlant: (plant) => {
			plant.stage++
			view.showPlantCollection(model.plants)
		}
	}

	controller.init()

})()