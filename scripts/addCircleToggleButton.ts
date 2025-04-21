// utils/addCircleToggleButton.ts
import { PDFName, PDFDict, PDFString, PDFBool } from 'pdf-lib';

interface Bounds { x: number; y: number; width: number; height: number; }

/**
 * Inserts a tiny push‑button that toggles a ● on/off when clicked.
 * Works in Acrobat Reader (with JS enabled) *and* forces Acrobat to repaint
 * field appearances by setting NeedAppearances.
 */
export function addCircleToggleButton(
  form: any,
  page: any,
  name: string,
  bounds: Bounds
) {
  // 0) Make Acrobat regenerate appearances whenever a field value changes:
  const acroForm = form.acroForm.dict;
  acroForm.set(PDFName.of('NeedAppearances'), PDFBool.True);

  // 1) Create the push‑button
  const btn: any = form.createButton(name);
  btn.addToPage(
    /* initial label */ '',
    /* page          */ page,
    /* options       */ {
      x:               bounds.x,
      y:               bounds.y,
      width:           bounds.width,
      height:          bounds.height,
      borderWidth:     0,
      backgroundColor: undefined,
    }
  );

  // 2) Build the toggle script
  const script = `
    var f = this.getField("${name}");
    if (f.buttonGetCaption() == "") 
      f.buttonSetCaption("●");
    else 
      f.buttonSetCaption("");
  `;

  // 3) Create a PDF action dictionary
  const widget = btn.acroField.getWidgets()[0];
  const actionDict = widget.dict.context.obj({
    S:  PDFName.of('JavaScript'),
    JS: PDFString.of(script),
  });

  // 4) Attach it under /AA → /U (Mouse Up)
  const aaDict = widget.dict.context.obj({ U: actionDict });
  widget.dict.set(PDFName.of('AA'), aaDict);

  return btn;
}
