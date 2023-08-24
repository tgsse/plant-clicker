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
		plantNameEl: undefined,
		plantCounterEl: undefined,
		plantImageEl: undefined,
		plantDateEl: undefined,
		plantCollectionEl: undefined,
		init: () => {
			view.plantNameEl = $("name")
			view.plantCounterEl = $("counter")
			view.plantImageEl = $("plantImageContainer")
			view.plantDateEl = $("plantDate")
			view.plantCollectionEl = $("plantCollectionContainer")
		},
		updatePlantCard: (plant) => {
			view.updatePlantName(plant.name)
			view.updateCounter(plant.counter)
			view.updateImage(plant)
			view.updateDate(plant.createdOn)
		},

		updatePlantName: (value) => {
			view.plantNameEl.innerText = value
		},

		updateCounter: (value) => {
			view.plantCounterEl.innerText = value
		},

		updateImage: (plant) => {
			view.plantImageEl.replaceChildren(viewUtils.buildPlantImage(plant, event => view.onPlantClick(event, plant)))
		},

		updateDate: (createdOn) => {
			view.plantDateEl.innerText = new Date(createdOn)
		},

		showPlantCollection: (plants) => {
			const plantCollection = plants.map(plant => {
				const li = document.createElement("li")
				const img = viewUtils.buildPlantImage(plant, (_) => {
					controller.state.selectedPlantId = plant.id
					view.updatePlantCard(plant)
				})
				li.append(img)
				return li
			})
			view.plantCollectionEl.replaceChildren(...plantCollection)
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
			view.init()
			view.showPlantCollection(model.plants)
		},

		evolvePlant: (plant) => {
			plant.stage++
			view.showPlantCollection(model.plants)
		}
	}

	controller.init()

})()