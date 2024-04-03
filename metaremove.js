const remove = function (imageBuffer, options) {

    const excludeSegments = ['APP1', 'APP11', 'APP10'];

    if (imageBuffer === undefined || imageBuffer.length < 2) {
        return undefined;
    }

    if (options === undefined) {
        options = {};
    }

    // Ensure it's a JPEG image before continuing
    var startPortion = imageBuffer[0].toString(16) + imageBuffer[1].toString(16);

    if (startPortion !== "ffd8") {
        throw new Error("Not a JPEG");
    }

    // Main portion which handles the logic for where to splice
    let offsetPairs = [{start: 0, end: 2, id: 'SOI'}];
    for (var i = 2; i + 1 < imageBuffer.length; i++) {
        // Gather the hex representation of the two bytes found at this point in string format
        let bytePortion = imageBuffer[i].toString(16) + imageBuffer[i + 1].toString(16);

        // There should be no metadata after the SOS marker
        if (bytePortion === "ffda") {
            break;
        }

        let marker;
        // Check for markers
        switch (bytePortion) {
            case "ffc0":
                marker = 'SOF0'
                break;
            case "ffc1":
                marker = 'SOF1'
                break;
            case "ffc2":
                marker = 'SOF2'
                break;
            case "ffc3":
                marker = 'SOF3'
                break;
            case "ffc4":
                marker = 'DHT'
                break;
            case "ffc5":
                marker = 'SOF5'
                break;
            case "ffc6":
                marker = 'SOF6'
                break;
            case "ffc7":
                marker = 'SOF7'
                break;
            case "ffc8":
                marker = 'JPG'
                break;
            case "ffc9":
                marker = 'SOF9'
                break;
            case "ffca":
                marker = 'SOF10'
                break;
            case "ffcb":
                marker = 'SOF11'
                break;
            case "ffcc":
                marker = 'DAC'
                break;
            case "ffcd":
                marker = 'SOF13'
                break;
            case "ffce":
                marker = 'SOF14'
                break;
            case "ffcf":
                marker = 'SOF15'
                break;
            case "ffdb":
                marker = 'DQT'
                break;
            case "ffdd":
                marker = 'DRI' // 4 bytes
                break;
            case "ffda":
                marker = 'SOS'
                break;
            case "ffe0":
                marker = 'APP0'
                break;
            // APP1 Marker (which is typically designated for EXIF)
            case "ffe1":
                marker = 'APP1'
                break;
            case "ffe2":
                marker = 'APP2'
                break;
            case "ffe3":
                marker = 'APP3'
                break;
            case "ffe4":
                marker = 'APP4'
                break;
            case "ffe5":
                marker = 'APP5'
                break;
            case "ffe6":
                marker = 'APP6'
                break;
            case "ffe7":
                marker = 'APP7'
                break;
            case "ffe8":
                marker = 'APP8'
                break;
            case "ffe9":
                marker = 'APP9'
                break;
            // APP10 Marker (which is typically designated for ActiveObject (multimedia messages / captions))
            case "ffea":
                marker = 'APP10'
                break;
            // APP11 Marker (which is typically designated for Photoshop AI data)
            case "ffeb":
                marker = 'APP11'
                break;
            case "ffec":
                marker = 'APP12'
                break;
            case "ffed":
                marker = 'APP13'
                break;
            case "ffee":
                marker = 'APP14'
                break;
            case "ffef":
                marker = 'APP15'
                break;
        }

        if (marker) {
            // Grab offset size of the segment data which is found in following two bytes
            let offsetSize = marker === 'DRI' ? 4 : imageBuffer[i + 2] * 256 + imageBuffer[i + 3];

            if (options.verbose) {
                console.log(marker+" start");
                console.log(
                    "offset in hex: " +
                    imageBuffer[i + 2].toString(16) +
                    imageBuffer[i + 3].toString(16),
                );
                console.log("offset in decimal: " + offsetSize);
            }

            let offsetEnd = i + offsetSize + 2;

            // Push the start and end offsets to the offset pairs,
            // to indicate that we want a slice of the data from these ends
            offsetPairs.push({
                start: i,
                end: offsetEnd,
                id: marker,
            });

            i = offsetEnd - 1;  // -1 to compensate increment on next loop

            if (options.verbose)
                console.log(
                    (
                        imageBuffer[i] * 256 +
                        imageBuffer[i + 1]
                    ).toString(16),
                );

            if (options.verbose) console.log("New i->" + i);
        }
    }

    // Write the last pair
    offsetPairs.push({
        start: i,
        end: imageBuffer.length,
        id: 'SOS'
    });

    if (options.verbose)
        offsetPairs.forEach((pair) => {
            console.log(pair);
        });

    // This part here will slice the image buffer into pieces with the
    // size and offset of each piece defined by the offset pairs
    const imageSlices = offsetPairs.map((pair) => {
        return excludeSegments.includes(pair.id) ? Buffer.from([]) : imageBuffer.slice(pair.start, pair.end);
    });

    return Buffer.concat(imageSlices);
};

module.exports.removeMultiple = function (imageBuffers, options) {
    if (options === undefined) {
        options = {};
    }

    return imageBuffers.map((imageBuffer) => remove(imageBuffer, options.verbose));
};

module.exports.remove = remove;
