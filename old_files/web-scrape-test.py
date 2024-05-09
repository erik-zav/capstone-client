import requests
from bs4 import BeautifulSoup

def scrape_courses(url):
   
    try:
        response = requests.get(url)
        response.raise_for_status()  
        soup = BeautifulSoup(response.text, 'html.parser')

       
        course_blocks = soup.find_all('div', class_='courseblock')
        for course_block in course_blocks:
            title = course_block.find('p', class_='courseblocktitle').get_text().strip()
            desc = course_block.find('p', class_='courseblockdesc').get_text().strip()
            
        
            print("Title:", title)
            print("Description:", desc)
            print("-" * 40)  

    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error occurred: {e}")
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error occurred: {e}")
    except requests.exceptions.Timeout as e:
        print(f"Timeout Error occurred: {e}")
    except requests.exceptions.RequestException as e:
        print(f"An Error occurred: {e}")


courses_url = "https://catalog.kent.edu/coursesaz/cs/"
scrape_courses(courses_url)
