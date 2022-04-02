#!/usr/bin/python

import sys
import argparse
import csv
import requests # /> pip install requests
from bs4 import BeautifulSoup # /> pip install beautifulsoup4


def get_args():
    """Add, parse, and return the argparser args."""
    parser = argparse.ArgumentParser(description='Wikipedia Scraper')
    parser.add_argument('-n', '--names', default=[], nargs='+', help="""Input Names: rotmilan braunpelikan ...""")
    parser.add_argument('-i', '--input', default=['names-list.txt'], nargs=1, help="""Input File Path: namesList.txt""")
    parser.add_argument('-o', '--output', default=['results.csv'], nargs=1, help="""Output File Path: results.csv""")
    return parser.parse_args()


def scrapePageForName(name):
    """Scrapes Wikipedia for results"""
    if ('' == name.strip()):
        return []
    name = name.strip()
    url = "https://de.wikipedia.org/wiki/"+name
    page = requests.get(url)
    if (404 == page.status_code):
        print('Error 404 ' +  name)
        return [name, '', '404 - page not found']
    soup = BeautifulSoup(page.content, "html.parser")
    title = soup.find("h1", "firstHeading").string
    latinNames = soup.find_all("td", class_="taxo-name")
    latin = latinNames[-1].i.string if len(latinNames) > 0 else ''
    if (404 != page.status_code and '' == latin):
        print('Error 204 ' +  name)
        return [name, '', '204 - latin not found']
    return [name, latin]

def go(fileIn, fileOut):
    """File in and out stream"""
    csv_writer = csv.writer(fileOut, quoting=csv.QUOTE_NONE, delimiter=',')
    csv_writer.writerow(["name", "latin"])

    for lineNum, line in enumerate(fileIn, start=1):
        row = scrapePageForName(line)
        csv_writer.writerow(row)

def main():
    args = get_args()

    if (len(args.names) == 0):
        with open(args.input[0], 'r') as fileIn, open(args.output[0], 'w', newline='') as fileOut:
            go(fileIn, fileOut)
    else:
        # append results from command line
        with open(args.output[0], 'a', newline='') as fileOut:
            csv_writer = csv.writer(fileOut, quoting=csv.QUOTE_NONE, delimiter=',')
            for name in args.names:
                row = scrapePageForName(name)
                csv_writer.writerow(row)


if __name__ == '__main__':
    main()
    sys.exit(1)
