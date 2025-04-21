import { applyCircleCheckboxAppearance } from './scripts/applyCircleCheckboxAppearance';

applyCircleCheckboxAppearance(name => name.startsWith('dot-'));

import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';

interface AddInputTextFields {
    idText: string; // Unique text ID
    count: number; // The amount of elements
    width: number; // Width of the element
    x: number; // Horizontal position
    y: number; // Initial vertical position
}

// Define the desired font size
const fontSize = 8;

async function createEditablePDF() {
  // Load static PDF
  const existingPdfBytes = fs.readFileSync('./wod-character-sheet.pdf');
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embed the font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Get the form so we can add fields
  const form = pdfDoc.getForm();
  form.updateFieldAppearances(helveticaFont);
  let page = pdfDoc.getPages()[0]; // Get the first page

  // Single line input fields
  function addTextInputFields({ idText, count, width, x, y: initialY }: AddInputTextFields) {
    for (let i = 0; i < count; i++) {
      const y = initialY - 13 * i;  // 13 is the estimated distance between elements
  
      const textField = form.createTextField(idText + i);
      textField.setText(''); // Start empty
      textField.addToPage(page, {
          x,   // Adjust to place right beside the colon
          y: y + i/5,   // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
          width,
          height: 11,
          borderWidth: 0,
          borderColor: undefined,
          backgroundColor: undefined, // make the background transparent
      });
      textField.acroField.setFontSize(fontSize);
    }
  }

  // Character data
  const characterData  = [
    {x: 78, y: 703, width: 132, name: "Name" },
    {x: 90, y: 688, width: 120, name: "Player" }, 
    {x: 110, y: 673, width: 100, name: "Chronicle" }, 
    {x: 263, y: 703, width: 110, name: "Virtue" }, 
    {x: 252, y: 688, width: 121, name: "Vice" }, 
    {x: 269, y: 673, width: 104, name: "Concept" }, 
    {x: 413, y: 703, width: 145, name: "Cell" }, 
    {x: 433, y: 688, width: 125, name: "Compact" }, 
    {x: 453, y: 673, width: 105, name: "Conspiracy" }, 
  ];

  // Go through all the elements in characterData and add the input text boxes.
  for(const { x, y, name, width } of characterData) {
    const textField = form.createTextField(name); // Create a textbox with a unique ID (name)
    textField.setText(''); // Start empty
    textField.addToPage(page, {
        x,   // Adjust to place right beside the colon
        y,   // Adjust vertical position
        width, // Set the width of the box
        height: 14, // Set the height of the box
        borderWidth: 0, // Set the width of border/outline of the box
      });

    // Set the default font size of the content
    textField.acroField.setFontSize(fontSize);
  }

  // Attributes
  const attributesData  = [
    {x: 235, y: 607, name: "Int" },
    {x: 235, y: 590, name: "Wits" }, 
    {x: 235, y: 574, name: "Res" }, 
    {x: 372, y: 607, name: "Str" }, 
    {x: 372, y: 590, name: "Dex" }, 
    {x: 372, y: 574, name: "Sta" }, 
    {x: 507, y: 607, name: "Cha" }, 
    {x: 507, y: 590, name: "Man" }, 
    {x: 507, y: 574, name: "Comp" }, 
  ];

  for(const { x, y, name } of attributesData) {
    for (let i = 0; i < 4; i++) {
      const checkbox = form.createCheckBox(`dot-${name}-${i}`);
      checkbox.addToPage(page, {
          x: x + 8 * i + i/5,   // Adjust to place right beside the colon
          y,   // Adjust vertical position
          width: 6,
          height: 7,
          borderWidth: 0,
          backgroundColor: undefined, // make the background transparent
        }
      );
    }
  }

  /*** Skills *********/

  const mental = 9;
  for (let i = 0; i < mental; i++) {
    const x = 154;
    const y = 481 - 13 * i; 

    for (let j = 0; j < 5; j++) {
      // Use both the i and j value to get an uniqe ID.
      const checkbox = form.createCheckBox(`dot-mental-skills-${i}-${j}`);
      // const checkbox = form.createCheckBox("mental-skills" + i + "-" + j);
      checkbox.addToPage(page, {
          /**
           * "x" is the initial position
           * add "width" to get past the width of the text field
           * add "4" to get some spacing
           * add "8 * j" to get some the distance between checkbox elements
           */
          x: x + 8 * j,   // Adjust to place right beside the colon
          y: y + i/5,   // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
          width: 6, // Width of the checkbox
          height: 7, // Height of the checkbox
          borderWidth: 0, // With 0 we remove the borders of the checkbox
          backgroundColor: undefined, // make the background transparent
      });
    }
  }

  addTextInputFields({
    idText: "mentalSkillText",
    count: 3,
    x: 88,
    y: 481,
    width: 62,
  });
  addTextInputFields({
    idText: "mentalSkill2Text",
    count: 1,
    x: 98,
    y: 442,
    width: 52,
  });
  addTextInputFields({
    idText: "mentalSkill3Text",
    count: 4,
    x: 82,
    y: 429,
    width: 68,
  });

  addTextInputFields({
    idText: "mentalSkill4Text",
    count: 1,
    x: 93,
    y: 377,
    width: 57,
  });

  const physical = 9;
  for (let i = 0; i < physical; i++) {
    const x = 155;
    const y = 324 - 13 * i - i/1.5; 

    for (let j = 0; j < 5; j++) {
      // Use both the i and j value to get an uniqe ID.
      const checkbox = form.createCheckBox(`dot-physical-skills-${i}-${j}`);
      checkbox.addToPage(page, {
          /**
           * "x" is the initial position
           * add "width" to get past the width of the text field
           * add "4" to get some spacing
           * add "8 * j" to get some the distance between checkbox elements
           */
          x: x + 8 * j,   // Adjust to place right beside the colon
          y: y + i/4.5,   // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
          width: 6, // Width of the checkbox
          height: 7, // Height of the checkbox
          borderWidth: 0, // With 0 we remove the borders of the checkbox
          backgroundColor: undefined, // make the background transparent
      });
    }
  }

  addTextInputFields({
    idText: "physicalSkillText",
    count: 1,
    x: 81,
    y: 324,
    width: 70,
  });
  addTextInputFields({
    idText: "physicalSkill2Text",
    count: 3,
    x: 70,
    y: 310,
    width: 81,
  });
  addTextInputFields({
    idText: "physicalSkill3Text",
    count: 1,
    x: 80,
    y: 271,
    width: 72,
  });
  addTextInputFields({
    idText: "physicalSkill4Text",
    count: 4,
    x: 76,
    y: 256,
    width: 76,
  });

  const social = 9;
  for (let i = 0; i < social; i++) {
    const x = 155;
    const y = 175 - 13 * i + i/3; 

    for (let j = 0; j < 5; j++) {
      // Use both the i and j value to get an uniqe ID.
      const checkbox = form.createCheckBox(`dot-social-skills-${i}-${j}`);
      checkbox.addToPage(page, {
          /**
           * "x" is the initial position
           * add "width" to get past the width of the text field
           * add "4" to get some spacing
           * add "8 * j" to get some the distance between checkbox elements
           */
          x: x + 8 * j,   // Adjust to place right beside the colon
          y: y + i/5,   // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
          width: 6, // Width of the checkbox
          height: 7, // Height of the checkbox
          borderWidth: 0, // With 0 we remove the borders of the checkbox
          backgroundColor: undefined, // make the background transparent
      });
    }
  }

  addTextInputFields({
    idText: "socialSkillText",
    count: 4,
    x: 97,
    y: 175,
    width: 54,
  });
  addTextInputFields({
    idText: "socialSkill2Text",
    count: 2,
    x: 97,
    y: 125,
    width: 54,
  });
  addTextInputFields({
    idText: "socialSkill3Text",
    count: 3,
    x: 90,
    y: 100,
    width: 61,
  });

  /*** Other traits ***/

  // Merits page 1
  const merits = 10;
  for (let i = 0; i < merits; i++) {
    const x = 215;
    const y = 492 - 13 * i; 
    const width = 105;

    const textField = form.createTextField("meritText" + i);
    textField.setText(''); // Start empty
    textField.addToPage(page, {
      x, // Adjust to place right beside the colon
      y: y + i/5, // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
      width,
      height: 11,
      borderWidth: 0,
    });
    textField.acroField.setFontSize(fontSize);

    for (let j = 0; j < 5; j++) {
      // Use both the i and j value to get an uniqe ID.
      const checkbox = form.createCheckBox(`dot-merit-${i}-${j}`);
      checkbox.addToPage(page, {
          /**
           * "x" is the initial position
           * add "width" to get past the width of the text field
           * add "4" to get some spacing
           * add "8 * j" to get some the distance between checkbox elements
           * add "j/5" because the spacing isn't 100% the same 
           */
          x: x + width + 4 + 8 * j + j/5,   // Adjust to place right beside the colon
          y: y + i/5,   // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
          width: 6, // Width of the checkbox
          height: 7, // Height of the checkbox
          borderWidth: 0, // With 0 we remove the borders of the checkbox
          backgroundColor: undefined, // make the background transparent
      });
    }
  }

  addTextInputFields({
    idText: "aspirationsText",
    count: 4,
    x: 215,
    y: 338,
    width: 145,
  });

  addTextInputFields({
    idText: "conditionsText",
    count: 5,
    x: 215,
    y: 261,
    width: 145,
  });

  addTextInputFields({
    idText: "touchstonesText",
    count: 8,
    x: 215,
    y: 171,
    width: 145,
  });

  // Health
  const health = 12;
  for (let i = 0; i < health; i++) {
    const x = 420 + 10 * i + i/3;
    const y = 495;

    const checkbox1 = form.createCheckBox("dot-health1-" + i);
    checkbox1.addToPage(page, {
        x,   // Adjust to place right beside the colon
        y,   // Adjust vertical position.
        width: 6, // Width of the checkbox
        height: 7, // Height of the checkbox
        borderWidth: 0, // With 0 we remove the borders of the checkbox
        backgroundColor: undefined, // make the background transparent
    });
    const checkbox2 = form.createCheckBox("health2-" + i);
    checkbox2.addToPage(page, {
        x,   // Adjust to place right beside the colon
        y: y - 12,   // Adjust vertical position.
        width: 7, // Width of the checkbox
        height: 8, // Height of the checkbox
        // borderWidth: 0, // With 0 we remove the borders of the checkbox
          backgroundColor: undefined, // make the background transparent
    });
  }

  // Willpower
  const willpower = 10;
  for (let i = 0; i < willpower; i++) {
    const x = 430 + 10 * i + i/3;
    const y = 452;

    const checkbox1 = form.createCheckBox("dot-willpower1-" + i);
    checkbox1.addToPage(page, {
        x,   // Adjust to place right beside the colon
        y,   // Adjust vertical position.
        width: 7, // Width of the checkbox
        height: 7, // Height of the checkbox
        borderWidth: 0, // With 0 we remove the borders of the checkbox
        backgroundColor: undefined, // make the background transparent
    });
    const checkbox2 = form.createCheckBox("willpower2-" + i);
    checkbox2.addToPage(page, {
        x,   // Adjust to place right beside the colon
        y: y - 12,   // Adjust vertical position.
        width: 7, // Width of the checkbox
        height: 8, // Height of the checkbox
        backgroundColor: undefined, // make the background transparent
    });
  }
  
  const checkboxRisked = form.createCheckBox("riskedWillpower");
  checkboxRisked.addToPage(page, {
      x: 498,   // Adjust to place right beside the colon
      y: 430,   // Adjust vertical position.
      width: 7, // Width of the checkbox
      height: 7, // Height of the checkbox
      backgroundColor: undefined, // make the background transparent
      // borderWidth: 0, // With 0 we remove the borders of the checkbox
  });

  // Morality
  const morality = 10;
  for (let i = 0; i < morality; i++) {
    const x = 528;// + 10 * i + i/3;
    const y = 397 - 12 * i - i/1.2;

    const checkbox1 = form.createCheckBox("dot-morality-" + i);
    checkbox1.addToPage(page, {
        x,   // Adjust to place right beside the colon
        y,   // Adjust vertical position.
        width: 7, // Width of the checkbox
        height: 7, // Height of the checkbox
        borderWidth: 0, // With 0 we remove the borders of the checkbox
        backgroundColor: undefined, // make the background transparent
    });
  }

  addTextInputFields({
    idText: "moralityText",
    count: 10,
    x: 441,
    y: 397,
    width: 84,
  });

  // Body stats
  addTextInputFields({
    idText: "sizeText",
    count: 1,
    x: 448,
    y: 261,
    width: 35,
  });

  addTextInputFields({
    idText: "speedText",
    count: 1,
    x: 513,
    y: 261,
    width: 22,
  });

  addTextInputFields({
    idText: "defenceText",
    count: 1,
    x: 459,
    y: 248,
    width: 24,
  });

  addTextInputFields({
    idText: "armorText",
    count: 1,
    x: 513,
    y: 248,
    width: 22,
  });

  addTextInputFields({
    idText: "initiativeText",
    count: 1,
    x: 491,
    y: 235,
    width: 44,
  });

  addTextInputFields({
    idText: "experienceText",
    count: 1,
    x: 479,
    y: 222,
    width: 57,
  });


  const breakDanger = 5;
  for (let i = 0; i < breakDanger; i++) {
    const x = 478 + 12 * i + i/1.25;
    const y = 211;

    const checkbox1 = form.createCheckBox("mentalBreak-" + i);
    checkbox1.addToPage(page, {
        x,   // Adjust to place right beside the colon
        y,   // Adjust vertical position.
        width: 7, // Width of the checkbox
        height: 7, // Height of the checkbox
        // borderWidth: 0, // With 0 we remove the borders of the checkbox
    });
    const checkbox2 = form.createCheckBox("danger-" + i);
    checkbox2.addToPage(page, {
        x,   // Adjust to place right beside the colon
        y: y - 12,   // Adjust vertical position.
        width: 7, // Width of the checkbox
        height: 7, // Height of the checkbox
        // borderWidth: 0, // With 0 we remove the borders of the checkbox
    });
  }

  addTextInputFields({
    idText: "derangementsText",
    count: 7,
    x: 420,
    y: 158,
    width: 120,
  });

  /** PAGE 2 */

  page = pdfDoc.getPages()[1]; // Get the first page

  // Merits page 2
  const meritsP2 = 9;
  for (let i = 0; i < meritsP2; i++) {
    const x = 40;
    const y = 674 - 13 * i; 
    const width = 108;

    const textField = form.createTextField("meritTextP2" + i);
    textField.setText(''); // Start empty
    textField.addToPage(page, {
      x, // Adjust to place right beside the colon
      y: y + i/5, // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
      width,
      height: 11,
      borderWidth: 0,
    });
    textField.acroField.setFontSize(fontSize);

    for (let j = 0; j < 5; j++) {
      // Use both the i and j value to get an uniqe ID.
      const checkbox = form.createCheckBox(`dot-meritp2-${i}-${j}`);
      checkbox.addToPage(page, {
          /**
           * "x" is the initial position
           * add "width" to get past the width of the text field
           * add "4" to get some spacing
           * add "8 * j" to get some the distance between checkbox elements
           * add "j/5" because the spacing isn't 100% the same 
           */
          x: x + width + 4 + 8 * j + j/5,   // Adjust to place right beside the colon
          y: y + i/5,   // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
          width: 6, // Width of the checkbox
          height: 7, // Height of the checkbox
          borderWidth: 0, // With 0 we remove the borders of the checkbox
          backgroundColor: undefined, // make the background transparent
      });
    }
  }

  const endowments = 15;
  for (let i = 0; i < endowments; i++) {
    const x = 40;
    const y = 520 - 13 * i; 
    const width = 108;

    const textField = form.createTextField("endowmentsTextP2" + i);
    textField.setText(''); // Start empty
    textField.addToPage(page, {
      x, // Adjust to place right beside the colon
      y: y + i/5, // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
      width,
      height: 11,
      borderWidth: 0,
    });
    textField.acroField.setFontSize(fontSize);

    for (let j = 0; j < 5; j++) {
      // Use both the i and j value to get an uniqe ID.
      const checkbox = form.createCheckBox(`dot-endowmentp2-${i}-${j}`);
      checkbox.addToPage(page, {
          /**
           * "x" is the initial position
           * add "width" to get past the width of the text field
           * add "4" to get some spacing
           * add "8 * j" to get some the distance between checkbox elements
           * add "j/5" because the spacing isn't 100% the same 
           */
          x: x + width + 4 + 8 * j + j/5,   // Adjust to place right beside the colon
          y: y + i/5,   // Adjust vertical position, adds slightly more as the elements aren't exactly spaced.
          width: 6, // Width of the checkbox
          height: 7, // Height of the checkbox
          borderWidth: 0, // With 0 we remove the borders of the checkbox
          backgroundColor: undefined, // make the background transparent
      });
    }
  }

  // Notes
  addTextInputFields({
    idText: "notesText",
    count: 17,
    x: 40,
    y: 288,
    width: 150,
  });

  // History
  addTextInputFields({
    idText: "historyText",
    count: 15,
    x: 213,
    y: 673,
    width: 350,
  });

  // Description
  addTextInputFields({
    idText: "descriptionText",
    count: 5,
    x: 213,
    y: 442,
    width: 350,
  });

  addTextInputFields({
    idText: "descriptionAgeText",
    count: 1,
    x: 238,
    y: 378,
    width: 134,
  });

  addTextInputFields({
    idText: "descriptionHeightText",
    count: 1,
    x: 445,
    y: 378,
    width: 118,
  });

  addTextInputFields({
    idText: "descriptionHairText",
    count: 1,
    x: 242,
    y: 365,
    width: 130,
  });

  addTextInputFields({
    idText: "descriptionWeightText",
    count: 1,
    x: 445,
    y: 365,
    width: 118,
  });

  addTextInputFields({
    idText: "descriptionEyesText",
    count: 1,
    x: 242,
    y: 352,
    width: 130,
  });

  addTextInputFields({
    idText: "descriptionRaceText",
    count: 1,
    x: 433,
    y: 352,
    width: 131,
  });

  addTextInputFields({
    idText: "descriptionSexText",
    count: 1,
    x: 238,
    y: 340,
    width: 134,
  });

  addTextInputFields({
    idText: "descriptionNationalityText",
    count: 1,
    x: 471,
    y: 340,
    width: 93,
  });

  // Equipment
  addTextInputFields({
    idText: "itemText",
    count: 6,
    x: 213,
    y: 276,
    width: 140,
  });

  addTextInputFields({
    idText: "itemDurabilityText",
    count: 6,
    x: 365,
    y: 276,
    width: 54,
  });

  addTextInputFields({
    idText: "itemStructureText",
    count: 6,
    x: 428,
    y: 276,
    width: 48,
  });

  addTextInputFields({
    idText: "itemSizeText",
    count: 6,
    x: 486,
    y: 276,
    width: 34,
  });

  addTextInputFields({
    idText: "itemCostText",
    count: 6,
    x: 530,
    y: 276,
    width: 34,
  });
  
  // Combat
  addTextInputFields({
    idText: "weaponText",
    count: 6,
    x: 213,
    y: 147,
    width: 108,
  });

  addTextInputFields({
    idText: "weaponDmgText",
    count: 6,
    x: 331,
    y: 147,
    width: 34,
  });

  addTextInputFields({
    idText: "weaponRangeText",
    count: 6,
    x: 375,
    y: 147,
    width: 40,
  });

  addTextInputFields({
    idText: "weaponMagText",
    count: 6,
    x: 425,
    y: 147,
    width: 27,
  });

  addTextInputFields({
    idText: "weaponInitText",
    count: 6,
    x: 462,
    y: 147,
    width: 27,
  });

  addTextInputFields({
    idText: "weaponStrText",
    count: 6,
    x: 499,
    y: 147,
    width: 27,
  });

  addTextInputFields({
    idText: "weaponSizeText",
    count: 6,
    x: 536,
    y: 147,
    width: 28,
  });

  // Save the modified PDF
  const pdfBytesEdited = await pdfDoc.save();
  fs.writeFileSync('./wod-interactive-character-sheet.pdf', pdfBytesEdited);
  console.log('PDF edited successfully and saved as wod-interactive-character-sheet.pdf');
}

createEditablePDF().catch(err => {
  console.error('Error creating editable PDF:', err);
});
