// Data transcribed from INE / DGEEC, "Inquérito Comunitário à Inovação 2022-2024"
// (Community Innovation Survey, Portugal), published 10 July 2026.
// Figures are % of companies with 10+ employees, unless noted otherwise.

const trend = {
  periods: ["2016–18", "2018–20", "2020–22", "2022–24"],
  series: [
    { name: "Any innovation activity", values: [32.4, 48.0, 44.7, 42.5] },
    { name: "Product innovation", values: [23.0, 22.3, 22.6, 24.3] },
    { name: "Process innovation", values: [28.0, 42.7, 40.4, 37.6] }
  ]
};

const whoInnovates = [
  { label: "All companies", value: 42.5 },
  { label: "Large companies (250+ staff)", value: 78.7 },
  { label: "Information & communication", value: 68.9 },
  { label: "Financial & insurance", value: 59.7 }
];

const sectorChange = [
  { label: "Industry", value: 2.3 },
  { label: "All sectors (average)", value: -2.2 },
  { label: "Financial & insurance", value: -5.9 },
  { label: "Transport & storage", value: -8.3 }
];

const spendingByRegion = [
  { label: "Greater Lisbon", value: 1950.8 },
  { label: "North", value: 1713.5 },
  { label: "Other regions", value: 1200.8 }
];
const spendingTotal2024 = 4865.1;
const spendingTotal2022 = 3382.4;
const greenSpendShare = 29.8;
const greenCompanyShare = 25.4;

const ipInstruments = [
  { label: "Trademark registration", value: 7.8 },
  { label: "Trade secrets", value: 3.4 },
  { label: "Patent application", value: 1.9 },
  { label: "Licensing IP to others", value: 1.6 },
  { label: "Industrial design registration", value: 1.3 }
];
