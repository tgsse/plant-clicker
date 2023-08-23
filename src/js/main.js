"use strict"

const imagesDir = "assets/images/"

class DomManager {
	updatePlantCard = (plant) => {
		this.updatePlantName(plant.name)
		this.updateCounter(plant.counter)
		this.updateImage(plant)
	}

	updatePlantName = (value) => {
		$("name").innerText = value
	}
	
	updateCounter = (value) => {
		$("counter").innerText = value
	}

	updateImage = (plant) => {
		$("plantImageContainer").replaceChildren(domManager.buildPlantImage(plant, event => onPlantClick(event, plant)))
	}

	buildPlantImage = (plant, onClick) => {
		const img = document.createElement("img")
		img.src = `${imagesDir}${plant.getImage()}`
		img.alt = "plant"
		img.style.cursor = "pointer"
		img.addEventListener("click", event => onClick(event, plant))
		return img
	}
}

const plants = [
	new Plant("plant1"),
	new Plant("plant2"),
	]

const state = {
	selectedPlantId: undefined,
}

const domManager = new DomManager()

init()

function init() {
	addPlantCollection()
}

function onPlantClick(event, plant) {
	if (plant.stage < plant.maxStage && ++plant.counter >= plant.stage * 3 + 3) {
		plant.stage++
		domManager.updatePlantCard(plant)
		addPlantCollection()
	}
	domManager.updateCounter(plant.counter)
}

function addPlantCollection() {
	const plantCollection = plants.map(plant => {
		const img = domManager.buildPlantImage(plant, (event) => {
			console.log("buildimg", {plant, event})
			state.selectedPlantId = plant.id
			domManager.updatePlantCard(plant)
		})
		return img
	})
	$("plantCollectionContainer").replaceChildren(...plantCollection)
}


// Utility

function $(id) {
	return document.getElementById(id)
}

