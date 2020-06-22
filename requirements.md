## Software Requirements:

### Libraries
- Express
- EJS
- dotenv
- superagent
- pg

### Other Requirements
- Database 
- Internet
- Text Editor
- GitHub Account 

### Vision

The user has a limited amount of time and wants to get the most out their weekend. This app gives you options to fill up the time you have available, whether it be a lot or a little making you a true weekend warrior. This website will be a one-stop-shop to give all the information you need like trail guides, playlists that match your adventure and restaurant recommendations etc.

### Scope 
- In
  - Allow user to search for camping, hiking, and rock climbing activities near their city or zip code
  - User will enter their name
  - Allow user to select favorite activities to render on a favorites page
  - User can update or delete favorites

- Out
  - User will not be able to obtain driving directions from home or current location to preferred activity. 

### Minimum Viable Product

- The application will take in user data in the form of a location and preferred activity and return results. Results will include suggested activities based on user location

### Stretch Goals

- Add soundtrack for activity option (Music API)
- Add Restaurant/Beer options for activity
- Add a form field for user to indentify amount of time available for chosen activity
- Add map that displays the locations of different activities on search results page
- Add pagination functionality 

### Functional Requirements

- User can enter name, location, and preferred activity
- User can update or delete favorite activities

- When a user arrives on the landing page, they will be prompted to enter a name, location and preferred activity. The preferred activity selector will trigger one of three different API superagent requests when the user presses the submit button. Results will render on a results page, complete with a list of suggested activity results. As a stretch goal, favorited results will render a map of the location, along with suggested music choices for the trip and eating options in the vicinity of the activity. The user can manage their favorite lists by updating or deleting favorite activities. The user will be able to toggle through four pages, including a home page, favorites page, results page, and developer bio page. 

### Non-functional requirements

- **Security**
  - Leverage Safe Values to prevent unwanted database manipulation.
  - Safe Values will be utilized when adding favorite activities to the application database. This security measure will take place each time a user chooses a favorite activity. 
- **Usability**
  - The Weekend Warrior Application is very simple and easy to use. Upon landing on the home page, a user will be prompted to enter a name, location (in the form of a city or zip code), and a preferred activity from a choice of three (rock climbing, camping, hiking). Upon submission, the user will be redirected to a results page. The user will be able to add individual resuts to a favorites list for future reference. In addition, the user can update or delete favorites on the favorite page. All  pages will include a simple set of navigational buttons to allow user to move back and forth between the home page, results page, and favorites page. If desired, the user can learn about the application developers as well. 