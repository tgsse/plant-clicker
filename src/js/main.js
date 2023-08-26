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
		uiState: {
			isEditorVisible: false,
			isDetailsVisible: false,
		},
		plantNameEl: undefined,
		plantCounterEl: undefined,
		plantImageEl: undefined,
		plantDateEl: undefined,
		plantCollectionEl: undefined,
		editBtnEl: undefined,
		editorEl: undefined,
		editorSubmitBtnEl: undefined,
		editNameField: undefined,

		init: (plants) => {
			view.plantNameEl = $("name")
			view.plantNameLabelEl = $("plantNameLabel")
			view.plantDetailsSectionEl = $("plantDetailsSection")
			view.plantCounterEl = $("counter")
			view.plantImageEl = $("plantImageContainer")
			view.plantDateEl = $("plantDate")
			view.plantCollectionEl = $("plantCollectionContainer")
			view.editBtnEl = $("editBtn")
			view.editorEl = $("editor")
			view.editorSubmitBtnEl = $("editorSubmitBtn")
			view.editNameField = $("editNameField")

			view.editBtnEl.addEventListener("click", view.onEditorToggle)
			view.editorEl.addEventListener("submit", event => event.preventDefault())

			view.showPlantCollection(plants)
		},

		updatePlantCard: (plant) => {
			view.updateName(plant.name)
			view.updateCounter(plant.counter)
			view.updateImage(plant)
			view.updateDate(plant.createdOn)
			if (!view.uiState.isDetailsVisible) {
				view.uiState.isDetailsVisible = true
				view.plantDetailsSectionEl.style.display = "flex"
			}
		},

		updateName: (value) => {
			view.plantNameEl.innerText = value
			view.plantNameLabelEl.innerText = value ? value : "nothing"
		},

		updateCounter: (value) => {
			view.plantCounterEl.innerText = value
		},

		updateImage: (plant) => {
			view.plantImageEl.replaceChildren(viewUtils.buildPlantImage(plant, event => view.onPlantSelected(event, plant)))
		},

		updateDate: (createdOn) => {
			view.plantDateEl.innerText = new Date(createdOn).toDateString()
		},

		clearNameInput: () => {
			view.editorEl.reset()
		},

		showPlantCollection: (plants) => {
			const plantCollection = plants.map(plant => {
				const li = document.createElement("li")
				const img = viewUtils.buildPlantImage(plant, (_) => {
					controller.state.selectedPlantId = plant.id
					view.updatePlantCard(plant)
				})
				img.classList.add("plantPreview")
				li.append(img)
				return li
			})
			view.plantCollectionEl.replaceChildren(...plantCollection)
		},

		onPlantSelected: (event, plant) => {
			if (plant.stage < plant.maxStage && ++plant.counter >= plant.stage * 3 + 3) {
				controller.evolvePlant(plant)
				view.updatePlantCard(plant)
			}
			view.updateCounter(plant.counter)
		},

		onEditorToggle: () => {
			if (controller.state.selectedPlantId === undefined) {
				alert("Trying to name something that isn't there is like trying to find a unicorn in a hamster's hideout – you're in for a legendary quest, but all you'll find are tiny paw prints and a bunch of confused hamsters! 🦄🐹")
				return
			}
			if (view.uiState.isEditorVisible) {
				view.editorSubmitBtnEl.removeEventListener("click", view.onEditorSubmit)
				view.clearNameInput()
				view.editorEl.classList.add("hidden")
				view.uiState.isEditorVisible = false
			} else {
				view.editorSubmitBtnEl.addEventListener("click", view.onEditorSubmit)
				view.editorEl.classList.remove("hidden")
				view.uiState.isEditorVisible = true
			}
		},

		onEditorSubmit: (event) => {
			event.preventDefault()
			const newName = view.editNameField.value
			controller.updatePlantName(newName)
		}
	}

	const model = {
		plants: [],

		init: () => {
			model.plants = [
				new Plant("plant1"),
				new Plant("plant2"),
			]
		}
	}

	const controller = {
		state: {
			selectedPlantId: undefined,
		},

		init: () => {
			model.init()
			view.init(model.plants)
		},

		evolvePlant: (plant) => {
			plant.stage++
			view.showPlantCollection(model.plants)
		},

		updatePlantName: (newName) => {
			if (newName.length === 0) {
				alert("Just like how a squirrel named Steve or a toaster named Tina adds a sprinkle of excitement to life, your plant could use a dash of that too!")
				return
			} else if (model.plants.find(p => p.name === newName)) {
				alert("Just like a rare orchid, that name's got a 'Do Not Pick' sign – it's been plucked by someone else!")
				view.clearNameInput()
				return
			}
			model.plants.find(p => p.id === controller.state.selectedPlantId).name = newName
			view.updateName(newName)
			view.onEditorToggle()
		}
	}

	controller.init()

})()