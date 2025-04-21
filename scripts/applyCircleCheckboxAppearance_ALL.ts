// applyCircleCheckboxAppearance.ts

// Grab the appearance module and the radio‑button drawer
// @ts-ignore: internal pdf-lib module
const appearances = require('pdf-lib/cjs/api/form/appearances');
// @ts-ignore: internal pdf-lib module
const { pushGraphicsState, popGraphicsState } = require('pdf-lib/cjs/api/operators');
// @ts-ignore: internal pdf-lib module
const { drawRadioButton } = require('pdf-lib/cjs/api/operations');
// @ts-ignore: import the color helper
const { rgb } = require('pdf-lib');

function applyCircleCheckboxAppearance(): void {
  // Monkey‑patch the checkbox provider to call drawRadioButton
  appearances.defaultCheckBoxAppearanceProvider = (_box: any, widget: any) => {
    const { width, height } = widget.getRectangle();
    // center + size
    const cx = width  / 2;
    const cy = height / 2;

    // “on” = filled ●
    const onOps = [
      pushGraphicsState(),
      ...drawRadioButton({
        x:           cx,
        y:           cy,
        width,
        height,
        borderColor: undefined,
        borderWidth: 0,
        color:       rgb(0, 0, 0), // fill color
        dotColor:    rgb(0, 0, 0), // inner dot color
        filled:      true,
      }),
      popGraphicsState(),
    ];

    // “off” = blank (no X, no circle)
    const offOps: any[] = [];

    return {
      normal: { off: offOps, on: onOps },
      down:   { off: offOps, on: onOps },
    };
  };
}

// force this file to be treated as a module
export { applyCircleCheckboxAppearance };
