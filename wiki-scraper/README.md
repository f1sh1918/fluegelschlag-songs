# Wiki-Scraper

Scrapes Wikipedia based on common bird names for their respective latin names.

## installation
- `python3 -m pip install requests`
- `python3 -m pip install beautifulsoup4` for https://beautiful-soup-4.readthedocs.io/en/latest/#


## usage
- `python3 scrape.py` to scrape all names available in name-list.text file / one bird name per file.
- `python3 scrape.py --names Rotmilan Rotkehlchen ...` Search for some birds and appends the result to the results.csv
