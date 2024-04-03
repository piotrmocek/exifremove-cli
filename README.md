# jpgclean-cli

Command-line tool to remove Metadata EXIF from JPEG images.
Metadata removed:
- APP1 - EXIF Metadata, TIFF IFD format; JPEG Thumbnail (160×120); Adobe XMP
- APP10 - ActiveObject (multimedia messages / captions)
- APP11 - HELIOS JPEG Resources (OPI Postscript)

## Installation

### Normal Installation

`npm install -g git+https://github.com/piotrmocek/jpgclean-cli`

### Development Installation

1. `cd` into project root. 
2. Run `npm install` to install CLI dependencies.
3. Run `npm link` to link `jpgclean` to global `node_modules`.

## Usage

```
jpgclean [image0] ... [imageN]

Options:
--version            Show version number                             [boolean]
-v, --verbose        Print extra messages                              [count]
-h, --help           Show help                                       [boolean]
```
