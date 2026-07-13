# Portugal's Innovation Boom Wasn't Built to Last

A data journalism piece I made for my data visualization homework. It uses D3.js to turn a
government statistics report into a short news story with charts.

**Read it here:** https://afonsoajrodrigues.github.io/portugal-innovation-2024/

## Where the data comes from

The source is `10CInovaçãoS2024.pdf` (included in this repo), a report from INE and DGEEC
(Portugal's national statistics offices) about their 2022–2024 Community Innovation Survey. It's
a real government report, not something I made up — it surveys about 15,000 Portuguese companies
every two years and asks whether they've introduced new products, new processes, R&D projects,
and so on.

## How I built it

1. **Pulled the numbers out of the PDF.** The report is a normal text PDF, not scanned images, so
   I used a Python library called [`natural-pdf`](https://github.com/jsoma/natural-pdf) to read
   the text and figure out which numbers belonged to which chart. One page in the report is an
   infographic with a lot of overlapping numbers, so I also used `natural-pdf`'s word-position
   tool to figure out which percentage lined up with which bar and which time period.
2. **Typed the numbers into `data.js`.** Once I knew what each number meant, I just wrote them out
   as plain JavaScript objects and arrays — nothing fancy, just labels and values.
3. **Charted them with D3.js.** `main.js` has a few small functions: one draws the line chart, one
   draws a normal horizontal bar chart (I reused it for three different charts), and one draws the
   chart that has both positive and negative bars. Each function does the same basic steps: set up
   a size, build a scale, draw the shapes, add the axis and labels.
4. **Wrote the story around it.** `index.html` has the actual article text, with a `<figure>` for
   each chart placed right where it's talked about, so the charts read as part of the story instead
   of a separate gallery.
5. **Styled it in `style.css`** to look like a simple news article — serif headline, readable body
   text, muted background, a two-color palette for the bars.

## Files

- `index.html` – the article: headline, text, and one `<figure>` per chart
- `style.css` – all the styling
- `data.js` – the numbers from the report, as plain JS objects
- `main.js` – the D3 code that draws the charts
- `10CInovaçãoS2024.pdf` – the original government report

## Running it locally

It's a static site, no build step and no dependencies to install. Just open `index.html` in a
browser, or run a tiny local server:

```
python3 -m http.server
```

and visit `localhost:8000`.
