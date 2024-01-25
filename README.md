# SoundSphere

**By: Lee Zhan Hong**

The forum will be a place where music aficionados can discuss anything music-related! For
instance, users can discuss a new album release, a concert in the area, or
simply song recommendations. Every thread must be tagged with the genre the
music discussed relates to for easier filtering. For example, a thread discussing
a Taylor Swift concert can be tagged with “country” and “pop”. This would help
music-lovers quickly find threads based on the music genre that they usually
listen to.

Extra functionalities:
1. Ability for the user to upvote threads. Threads with more upvotes are
   deemed more popular/interesting and would be displayed first.
2. Ability for the user to sort threads based on timestamp and/or upvotes.
3. Ability for the user to tag the thread with several tags which can then be
   used to filter threads

## Technologies Used

### Frontend: 
- React
- Redux
- Material UI

### Backend: 
- Go 
- Go-Chi
- Gorm
- Golang-jwt

### Database:
- PostgreSQL

## Usage

### Requirements
- Git 
- Docker Compose

### Setup
1. Clone this repository:
```git clone https://github.com/Zhannyhong/cvwo-assignment```
2. Change directory into the cloned repository:
```cd cvwo-assignment```
3. Build and run the docker containers: 
```docker-compose up -d```

The forum can then be viewed at `http://localhost:3000`. By default, the database will be populated with data from 
`database/database.sql`. The users already in the database can be logged in using the same password as their username.
