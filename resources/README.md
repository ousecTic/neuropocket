# App Icons

This folder contains the source icon for generating app icons across platforms.

## Source Icon

- **icon.png** - The Neuropocket logo (transparent background)
  - Used to generate Android app icons
  - Used for Electron desktop app (PNG format)

## Android Icons

Android icons are automatically generated from `icon.png` using `@capacitor/assets`.

To regenerate Android icons after updating the source icon:

```bash
npm run generate:icons
```

This will create all required Android icon sizes in:
- `android/app/src/main/res/mipmap-*/ic_launcher.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_foreground.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_round.png`

Plus splash screens in various densities.

## Electron Icons

Electron uses icons from `electron/assets/`:
- **appIcon.png** - PNG version (copied from icon.png)
- **appIcon.ico** - Windows ICO format

### Converting PNG to ICO (Manual Step)

The `appIcon.ico` file needs to be created manually from `appIcon.png`. You can use:

1. **Online converter**: https://convertio.co/png-ico/ or https://www.icoconverter.com/
2. **ImageMagick** (if installed):
   ```bash
   magick convert appIcon.png -define icon:auto-resize=256,128,64,48,32,16 appIcon.ico
   ```

Upload/convert `electron/assets/appIcon.png` to ICO format and save as `electron/assets/appIcon.ico`.

## Icon Requirements

- **Minimum size**: 1024x1024px (for best quality across all platforms)
- **Format**: PNG with transparent background
- **Content**: Should be centered with padding for safe area
