//! GLOBAL VARIBALES

const canvas = document.querySelector("canvas"),
	toolBtns = document.querySelectorAll(".tool"),
	drawingBoard = document.querySelector(".drawing-board"),
	clearCanvas = document.querySelector(".clear-canvas"),
	saveImg = document.querySelector(".save-img"),
	sizeSlider = document.querySelector("#size-slider"),
	colorsBtn = document.querySelectorAll(".colors .option"),
	colorPicker = document.querySelector("#color-picker"),
	fillСolor = document.querySelector("#fill-color");

// ! VARIBALE

let ctx = canvas.getContext("2d"),
	isDrawing = false,
	brushWidth = 5,
	selectedTool = "brush",
	selectedColor = "#000",
	prevMouseX,
	prevMouseY,
	snapshot

// ! SET CANVAS WIGHT AND HIGHT 
window.addEventListener("load", (e) => {
	canvas.width = canvas.offsetWidth
	canvas.height = canvas.offsetHeight
	setCannvasBackground()
})

// ! STARTDRAWING

const startDraw = e => {
	isDrawing = true
	prevMouseX = e.offsetX
	prevMouseY = e.offsetY
	ctx.beginPath()
	ctx.lineWidth = brushWidth
	ctx.strokeStyle = selectedColor
	ctx.fillСolor = selectedColor
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
	console.log(snapshot);
}
// ! DRAW RECTANGLE

const drawRectangle = e => {
	if (!fillСolor.checked) {
		return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
	}
	ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)

}
// ! DRAW CIRCLE
const drawCircle = (e) => {
	ctx.beginPath()
	const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) + Math.pow(prevMouseY - e.offsetY, 2)
	ctx.arc(prevMouseX, prevMouseY, radius, 50, 0, 2 * Math.PI)
	ctx.stroke()

	if (fillСolor.checked) {
		return ctx.fill()
	}

}

// ! DRAW TRIANGLE

const drawTriangle = (e) => {
	ctx.beginPath()
	ctx.moveTo(prevMouseX, prevMouseY)
	ctx.lineTo(e.offsetX, e.offsetY)
	ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
	ctx.closePath()
	ctx.stroke()

	if (fillСolor.checked) {
		return ctx.fill()
	}
}

// ! DRAWING

const drawing = e => {
	if (!isDrawing) return
	ctx.putImageData(snapshot, 0, 0)

	if (selectedColor == "brush" || selectedTool == "eraser") {
		ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor

	}

	switch (selectedTool) {
		case "brush":
			ctx.lineTo(e.offsetX, e.offsetY)
			ctx.stroke()
			console.log(selectedTool);
			break;
		case "rectangle":
			drawRectangle(e)
			break;
		case "circle":
			drawCircle(e)
			break;
		case "triangle":
			drawTriangle(e)
			break;
		case "eraser":
			ctx.strokeStyle = "#fff"
			ctx.lineTo(e.offsetX, e.offsetY)
			ctx.stroke()
			console.log(selectedTool);
			break;
		default:
			break;
	}



}

// ! TOOLS BTN AND SET TO VARIABLES SELECTED TOOL

toolBtns.forEach(btn => {
	btn.addEventListener("click", (e) => {
		document.querySelector('.options .active').classList.remove('active')
		btn.classList.add("active")
		selectedTool = btn.id
		console.log(`SelectedTool: - ${btn.id}`);
		// console.log(selectedTool);
	})

})

// ! STOPDRAWING

const endDraw = () => {
	isDrawing = false
}

// ! CHANGE WIGHT

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value))

// ! SET COLORFROM PICEK

colorPicker.addEventListener("change", () => {
	colorPicker.parentElement.style.background = colorPicker.value
	colorPicker.parentElement.click()
})

// ! SET COLOR TO SHEAPS
colorsBtn.forEach(btn => {
	btn.addEventListener("click", (e) => {
		document.querySelector(".options .selected").classList.remove("selected")
		btn.classList.add("selected")
		const bgColor = window.getComputedStyle(btn).getPropertyValue("background-color")
		selectedColor = bgColor
		console.log(bgColor);
	})
})

// ! CLEAR CANVAS

clearCanvas.addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	setCannvasBackground()
})
// ! SAVE IMG
saveImg.addEventListener("click", () => {
	const link = document.createElement("a")
	link.download = `paint${Date.now()}.jpg`
	link.href = canvas.toDataURL()
	link.click()
})

const setCannvasBackground = () => {
	ctx.fillStyle = '#fff'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = selectedColor
}
canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", endDraw)