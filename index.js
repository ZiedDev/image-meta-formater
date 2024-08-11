// Importing colorThief
const colorThief = new ColorThief();

// Global variables
let globalMetaData = ''
let globalImage

// Image input / Canvas
const imageInput = document.getElementById('image-input')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")
ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)

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
const textSideSlider = document.getElementById('text-side-slider')
const palletMarginSlider = document.getElementById('pallet-margin-slider')
const palletSizeSlider = document.getElementById('pallet-size-slider')
const palletCountSlider = document.getElementById('pallet-count-slider')

topTextSlider.addEventListener('input', drawCanvas)
widthSlider.addEventListener('input', drawCanvas)
topMarginSlider.addEventListener('input', drawCanvas)
bottomMarginSlider.addEventListener('input', drawCanvas)
sideMarginSlider.addEventListener('input', drawCanvas)
textSizeSlider.addEventListener('input', drawCanvas)
topSubtextSlider.addEventListener('input', drawCanvas)
subtextSizeSlider.addEventListener('input', drawCanvas)
textSideSlider.addEventListener('input', drawCanvas)
palletMarginSlider.addEventListener('input', drawCanvas)
palletSizeSlider.addEventListener('input', drawCanvas)
palletCountSlider.addEventListener('input', drawCanvas)

window.addEventListener('resize', drawCanvas)

// Functions
async function getExif(image) {
    const tags = await ExifReader.load(image, { async: true })
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
            globalMetaData.colors = result = colorThief.getPalette(img);
            globalImage = img
            widthSlider.value = globalMetaData.Width - 2
            widthSlider.max = globalMetaData.Width - 2
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

    const textTop = Number(topTextSlider.value) / 100 * height + topMargin
    const subtextTop = Number(topSubtextSlider.value) / 100 * height + topMargin

    topTextSlider.min = (-(topMargin / (topMargin + height + bottomMargin))) * 100 > topTextSlider.value ? topTextSlider.value : (-(topMargin / (topMargin + height + bottomMargin))) * 100
    topSubtextSlider.min = (-(topMargin / (topMargin + height + bottomMargin))) * 100 > topSubtextSlider.value ? topSubtextSlider.value : (-(topMargin / (topMargin + height + bottomMargin))) * 100

    topTextSlider.max = ((height + bottomMargin) / (topMargin + height + bottomMargin)) * 100
    topSubtextSlider.max = ((height + bottomMargin) / (topMargin + height + bottomMargin)) * 100

    const textSize = Number(textSizeSlider.value) / 2000 * width
    const subtextSize = Number(subtextSizeSlider.value) / 2000 * width

    const textSide = Number(textSideSlider.value) / 100 * (width / 2 - Math.max(ctx.measureText(globalMetaData.Lens).width, ctx.measureText(`${globalMetaData.FocalLength.replace(' ', '')}   f${globalMetaData.ApertureValue}   ${globalMetaData.ShutterSpeedValue}s   ISO${globalMetaData.ISOSpeedRatings}`).width))

    const palletMargin = Number(palletMarginSlider.value) / 200 * width
    const palletSize = Number(palletSizeSlider.value) / 200 * width
    const palletCount = Number(palletCountSlider.value)

    canvas.style.transform = `scale(${(window.innerWidth * 3 / 4) / (width + sideMargin * 2)})`

    canvas.setAttribute('width', width + sideMargin * 2)
    canvas.setAttribute('height', height + topMargin + bottomMargin)

    // filling background white
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // image
    ctx.drawImage(globalImage, sideMargin, topMargin, width, height)

    // lens model text
    ctx.fillStyle = 'black'
    ctx.font = `bold ${textSize}px MonaSans`
    ctx.fillText(globalMetaData.Lens, sideMargin + textSide, textTop)

    // camera model text
    ctx.font = `${subtextSize}px MonaSans`
    ctx.fillText(globalMetaData.Model, sideMargin + textSide, subtextTop)

    // date text
    ctx.textAlign = "right"
    ctx.font = `${subtextSize}px MonaSans`
    ctx.fillText(globalMetaData.DateTimeOriginal, width + sideMargin - textSide, subtextTop)

    // lens settings text
    ctx.font = `bold ${textSize}px MonaSans`
    ctx.fillText(`${globalMetaData.FocalLength.replace(' ', '')}   f${globalMetaData.ApertureValue}   ${globalMetaData.ShutterSpeedValue}s   ISO${globalMetaData.ISOSpeedRatings}`, width + sideMargin - textSide, textTop)

    // filling colors
    for (let i = 0; i < palletCount; i++) {
        ctx.fillStyle = `rgb(${globalMetaData.colors[i].join()})`
        ctx.fillRect(sideMargin + i * (width / palletCount), height + topMargin + palletMargin, (width / palletCount), palletSize)
    }
}