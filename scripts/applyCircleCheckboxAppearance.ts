// applyCircleCheckboxAppearance.ts
// @ts-ignore: internal pdf-lib module
import * as appearances from 'pdf-lib/cjs/api/form/appearances';
// @ts-ignore
import { pushGraphicsState, popGraphicsState } from 'pdf-lib/cjs/api/operators';
// @ts-ignore
import { drawRadioButton } from 'pdf-lib/cjs/api/operations';
// @ts-ignore
import { rgb } from 'pdf-lib';

type Predicate = (fieldName: string) => boolean;

/**
 * Override pdf-lib's checkbox appearance only for fields
 * whose PDFCheckBox.getName() passes `shouldCircle`.
 */
function applyCircleCheckboxAppearance(shouldCircle: Predicate) {
  // Keep the original X‑drawing provider
  const orig = (appearances as any).defaultCheckBoxAppearanceProvider;

  // Install branching provider
  (appearances as any).defaultCheckBoxAppearanceProvider =
    (checkbox: any, widget: any) => {
      const name = checkbox.getName();        // ← correct method

      if (!shouldCircle(name)) {
        // Not in our circle set → default “X”
        return orig(checkbox, widget);
      }

      // Otherwise draw a filled circle
      const { width, height } = widget.getRectangle();
      const cx = width  / 2;
      const cy = height / 2;

      const onOps = [
        pushGraphicsState(),
        ...drawRadioButton({
          x:           cx,
          y:           cy,
          width,
          height,
          borderColor: undefined,
          borderWidth: 0,
          color:       rgb(0, 0, 0),
          dotColor:    rgb(0, 0, 0),
          filled:      true,
        }),
        popGraphicsState(),
      ];

      return {
        normal: { off: [], on: onOps },
        down:   { off: [], on: onOps },
      };
    };
}


export { applyCircleCheckboxAppearance }