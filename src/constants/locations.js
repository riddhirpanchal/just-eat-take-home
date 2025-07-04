export const LOCATIONS = [
  { postcode: "CT12EH", area: "Ramsgate" },
  { postcode: "BS14DJ", area: "Bristol" },
  { postcode: "L40TH", area: "Ormskirk" },
  { postcode: "NE97TY", area: "Gateshead" },
  { postcode: "SW1A1AA", area: "London (Westminster)" },
  { postcode: "CF118AZ", area: "Cardiff" },
  { postcode: "M160RA", area: "Manchester" },
  { postcode: "EH11RE", area: "Edinburgh" },
  { postcode: "BN11AE", area: "Worthing" },
  { postcode: "CB74DL", area: "Ely" },
  { postcode: "LS27HY", area: "Leeds" },
  { postcode: "G38AG", area: "Glasgow" },
  { postcode: "PL40DW", area: "Plymouth" },
  { postcode: "B263QJ", area: "Birmingham" },
  { postcode: "DH45QZ", area: "Houghton le Spring" },
  { postcode: "BT71NN", area: "Belfast" },
  { postcode: "EC4M7RF", area: "London (City of London)" },
];

export const AUTOCOMPLETE_DATA = LOCATIONS.map(
  (loc) => `${loc.area} - ${loc.postcode}`
);
