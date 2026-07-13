# Portugal's Innovation Slowdown

A short data journalism piece built with D3.js for my data visualization homework.

Data source: INE / DGEEC, *Inquérito Comunitário à Inovação 2022–2024* (Community Innovation
Survey), the PDF is included in this repo (`10CInovaçãoS2024.pdf`). I used the `natural-pdf`
Python library to pull the text and table values out of the PDF before charting them.

## Files

- `index.html` – article structure and text
- `style.css` – styling
- `data.js` – the numbers, transcribed from the report
- `main.js` – D3 chart functions (one bar chart helper, one line chart)

## Running it locally

It's a static site, no build step. Just open `index.html` in a browser, or run:

```
python3 -m http.server
```

and visit `localhost:8000`.
