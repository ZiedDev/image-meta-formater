// Global variables
let globalMetaData = ''
let globalImage

// Image input / Canvas
const imageInput = document.getElementById('image-input')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")

imageInput.addEventListener('input', async e => { await readImport(e) })

// Sliders
const widthSlider = document.getElementById('width-slider')
const topMarginSlider = document.getElementById('top-margin-slider')
const bottomMarginSlider = document.getElementById('bottom-margin-slider')
const topTextSlider = document.getElementById('top-text-slider')
const textSizeSlider = document.getElementById('text-size-slider')
const topSubtextSlider = document.getElementById('top-subtext-slider')
const subtextSizeSlider = document.getElementById('subtext-size-slider')
const sideMarginSlider = document.getElementById('side-margin-slider')

topTextSlider.addEventListener('input', drawCanvas)
widthSlider.addEventListener('input', drawCanvas)
topMarginSlider.addEventListener('input', drawCanvas)
bottomMarginSlider.addEventListener('input', drawCanvas)
textSizeSlider.addEventListener('input', drawCanvas)
topSubtextSlider.addEventListener('input', drawCanvas)
subtextSizeSlider.addEventListener('input', drawCanvas)
sideMarginSlider.addEventListener('input', drawCanvas)

// Functions
async function getExif(imageNode) {
    const tags = await ExifReader.load(imageNode, { async: true })
    const extractedMetaData = {
        Model: tags.Model.description,
        Lens: tags.LensModel.description,
        ISOSpeedRatings: tags.ISOSpeedRatings.value,
        ShutterSpeedValue: tags.ShutterSpeedValue.description,
        ApertureValue: tags.ApertureValue.description,
        FocalLength: tags.FocalLength.description,
        DateTimeOriginal: tags.DateTimeOriginal.description,
        Width: Number(tags["Image Width"].description.replace('px', '')),
        Height: Number(tags["Image Height"].description.replace('px', ''))
    }
    globalMetaData = extractedMetaData
    console.log(globalMetaData)
}

async function readImport(file) {
    const input = file.target
    const reader = new FileReader()
    reader.onload = async function () {
        const dataURL = reader.result
        const img = new Image()
        await getExif(dataURL)
        img.src = dataURL
        img.onload = () => {
            globalImage = img
            widthSlider.value = globalMetaData.Width
            widthSlider.max = globalMetaData.Width
            drawCanvas()
        }
    }
    reader.readAsDataURL(input.files[0])
}

function drawCanvas() {
    if (globalImage == undefined || globalMetaData == undefined) return
    const width = Number(widthSlider.value)
    const height = (width * globalMetaData.Height) / globalMetaData.Width
    const topMargin = Number(topMarginSlider.value) / 200 * width
    const bottomMargin = Number(bottomMarginSlider.value) / 200 * width
    const sideMargin = Number(sideMarginSlider.value) / 100 * width
    const textTop = Number(topTextSlider.value) / 200 * width
    const subtextTop = Number(topSubtextSlider.value) / 200 * width
    const textSize = Number(textSizeSlider.value) / 2000 * width
    const subtextSize = Number(subtextSizeSlider.value) / 2000 * width

    canvas.style.transform = `scale(${(window.innerWidth * 3 / 4) / (width + sideMargin * 2)})`

    canvas.setAttribute('width', width + sideMargin * 2)
    canvas.setAttribute('height', height + topMargin + bottomMargin)

    // filling background white
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // lens model
    ctx.fillStyle = 'black'
    ctx.font = `bold ${textSize}px MonaSans`
    ctx.fillText(globalMetaData.Lens, sideMargin, topMargin - textTop)

    // camera model
    ctx.font = `${subtextSize}px MonaSans`
    ctx.fillText(globalMetaData.Model, sideMargin, topMargin - subtextTop)

    // date
    ctx.textAlign = "right"
    ctx.font = `${subtextSize}px MonaSans`
    ctx.fillText(globalMetaData.DateTimeOriginal, width + sideMargin, topMargin - subtextTop)

    // lens settings
    ctx.font = `bold ${textSize}px MonaSans`
    ctx.fillText(`${globalMetaData.FocalLength.replace(' ', '')}   f${globalMetaData.ApertureValue}   ${globalMetaData.ShutterSpeedValue}s   ISO${globalMetaData.ISOSpeedRatings}`, width + sideMargin, topMargin - textTop)

    // image
    ctx.drawImage(globalImage, sideMargin, topMargin, width, height)
}