const imageInput = document.getElementById('image-input')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")

let globalMetaData = ''
let globalImage

imageInput.addEventListener('input', async e => { await readImport(e); })

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
        Width: tags["Image Width"].description.replace('px', ''),
        Height: tags["Image Height"].description.replace('px', '')
    }
    globalMetaData = extractedMetaData
    console.log(globalMetaData);
}

async function readImport(file) {
    const input = file.target;
    const reader = new FileReader();
    reader.onload = async function () {
        const dataURL = reader.result;
        const img = new Image()
        await getExif(dataURL)
        img.src = dataURL;
        img.onload = () => {
            globalImage = img
            drawCanvas()
        }
    }
    reader.readAsDataURL(input.files[0]);
}

function drawCanvas({ width, topMargin, bottomMargin, textTop, textSize, subtextTop, subtextSize, sideMargin } = { width: 50, topMargin: 600, bottomMargin: 300, textTop: 250, textSize: 100, subtextTop: 125, subtextSize: 75, sideMargin: 300 }) {
    if (globalImage == undefined || globalMetaData == undefined) return

    canvas.setAttribute('width', Number(globalMetaData.Width) + sideMargin * 2)
    canvas.setAttribute('height', Number(globalMetaData.Height) + topMargin + bottomMargin)

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.font = `bold ${textSize}px MonaSans`;
    ctx.fillText(globalMetaData.Lens, sideMargin, topMargin - textTop);

    ctx.font = `${subtextSize}px MonaSans`;
    ctx.fillText(globalMetaData.Model, sideMargin, topMargin - subtextTop);

    ctx.textAlign = "right";
    ctx.font = `${subtextSize}px MonaSans`;
    ctx.fillText(globalMetaData.DateTimeOriginal, Number(globalMetaData.Width) + sideMargin, topMargin - subtextTop);

    ctx.font = `bold ${textSize}px MonaSans`;
    ctx.fillText(`${globalMetaData.FocalLength.replace(' ', '')}   f${globalMetaData.ApertureValue}   ${globalMetaData.ShutterSpeedValue}s   ISO${globalMetaData.ISOSpeedRatings}`, Number(globalMetaData.Width) + sideMargin, topMargin - textTop);

    ctx.drawImage(globalImage, sideMargin, topMargin, globalMetaData.Width, globalMetaData.Height);
}

const widthSlider = document.getElementById('width-slider')
const topMarginSlider = document.getElementById('top-margin-slider')
const bottomMarginSlider = document.getElementById('bottom-margin-slider')
const topTextSlider = document.getElementById('top-text-slider')
const textSizeSlider = document.getElementById('text-size-slider')
const topSubtextSlider = document.getElementById('top-subtext-slider')
const subtextSizeSlider = document.getElementById('subtext-size-slider')
const sideMarginSlider = document.getElementById('side-margin-slider')

topTextSlider.addEventListener('input', e => {
    drawCanvas({ width: Number(widthSlider.value), topMargin: Number(topMarginSlider.value), bottomMargin: Number(bottomMarginSlider.value), textTop: Number(topTextSlider.value), textSize: Number(textSizeSlider.value), subtextSize: Number(subtextSizeSlider.value), subtextTop: Number(topSubtextSlider.value), sideMargin: Number(sideMarginSlider.value) })
})

widthSlider.addEventListener('input', e => {
    drawCanvas({ width: Number(widthSlider.value), topMargin: Number(topMarginSlider.value), bottomMargin: Number(bottomMarginSlider.value), textTop: Number(topTextSlider.value), textSize: Number(textSizeSlider.value), subtextSize: Number(subtextSizeSlider.value), subtextTop: Number(topSubtextSlider.value), sideMargin: Number(sideMarginSlider.value) })
})

topMarginSlider.addEventListener('input', e => {
    drawCanvas({ width: Number(widthSlider.value), topMargin: Number(topMarginSlider.value), bottomMargin: Number(bottomMarginSlider.value), textTop: Number(topTextSlider.value), textSize: Number(textSizeSlider.value), subtextSize: Number(subtextSizeSlider.value), subtextTop: Number(topSubtextSlider.value), sideMargin: Number(sideMarginSlider.value) })
})

bottomMarginSlider.addEventListener('input', e => {
    drawCanvas({ width: Number(widthSlider.value), topMargin: Number(topMarginSlider.value), bottomMargin: Number(bottomMarginSlider.value), textTop: Number(topTextSlider.value), textSize: Number(textSizeSlider.value), subtextSize: Number(subtextSizeSlider.value), subtextTop: Number(topSubtextSlider.value), sideMargin: Number(sideMarginSlider.value) })
})

textSizeSlider.addEventListener('input', e => {
    drawCanvas({ width: Number(widthSlider.value), topMargin: Number(topMarginSlider.value), bottomMargin: Number(bottomMarginSlider.value), textTop: Number(topTextSlider.value), textSize: Number(textSizeSlider.value), subtextSize: Number(subtextSizeSlider.value), subtextTop: Number(topSubtextSlider.value), sideMargin: Number(sideMarginSlider.value) })
})

topSubtextSlider.addEventListener('input', e => {
    drawCanvas({ width: Number(widthSlider.value), topMargin: Number(topMarginSlider.value), bottomMargin: Number(bottomMarginSlider.value), textTop: Number(topTextSlider.value), textSize: Number(textSizeSlider.value), subtextSize: Number(subtextSizeSlider.value), subtextTop: Number(topSubtextSlider.value), sideMargin: Number(sideMarginSlider.value) })
})
subtextSizeSlider.addEventListener('input', e => {
    drawCanvas({ width: Number(widthSlider.value), topMargin: Number(topMarginSlider.value), bottomMargin: Number(bottomMarginSlider.value), textTop: Number(topTextSlider.value), textSize: Number(textSizeSlider.value), subtextSize: Number(subtextSizeSlider.value), subtextTop: Number(topSubtextSlider.value), sideMargin: Number(sideMarginSlider.value) })
})

sideMarginSlider.addEventListener('input', e => {
    drawCanvas({ width: Number(widthSlider.value), topMargin: Number(topMarginSlider.value), bottomMargin: Number(bottomMarginSlider.value), textTop: Number(topTextSlider.value), textSize: Number(textSizeSlider.value), subtextSize: Number(subtextSizeSlider.value), subtextTop: Number(topSubtextSlider.value), sideMargin: Number(sideMarginSlider.value) })
})