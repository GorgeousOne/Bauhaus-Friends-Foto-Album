from selenium import webdriver
from selenium.webdriver.common.by import By
import re

def main():
	driver = webdriver.Chrome()
	links = find_table_links(driver)

	all_programs = set()

	for link in links:
		programs = get_study_programs(driver, link)
		all_programs.update(programs)

	driver.quit()
	print(all_programs)
	save_to_file(all_programs)

def find_table_links(driver):
	url = "https://bison.uni-weimar.de/qisserver/rds?state=wtree&search=1&category=veranstaltung.browse"
	driver.get(url)
	rows = driver.find_elements(By.XPATH, "//a[@class='ueb']")
	return [row.get_attribute("href") for row in rows]


def get_study_programs(driver, link):
	degrees = ["B.", "M.", "Ph.D."]

	driver.get(link)
	rows = driver.find_elements(By.XPATH, "//a[@class='ueb']")
	programs = []

	for row in rows:
		description = row.get_attribute("innerHTML").strip()

		if not any(degree in description for degree in degrees):
			continue
		programs.append(re.split(r'[\(\[]', description)[0].strip())
	return programs


def save_to_file(programs):
	sorted_programs = sorted(programs)

	with open("study-programs.txt", "w", encoding="utf-8") as file:
		for program in sorted_programs:
			file.write(program + "\n")


if __name__ == "__main__":
	main()