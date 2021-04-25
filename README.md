npm i nodemon --save-dev


for debugging purposes install nodemon globally

npm i nodemon -g

npm i --save express

npm i --save body-parser 

npm install --save ejs pug express-handlebars


to run the application 

npm run start

npm install --save mongoose

//docker commands

1. to see the images

docker images

2. to build the docker image

docker build -t <imageName:version> dockerFilePath

docker build -t my_node_with_mongo:latest .

3. ENTRYPOINT keyword makes the docker container executable

4. to run the docker container

docker run -it <imageName:tag>

5. to see the running docker process

docker ps

docker ps -a (was a container, which is killed)

6. -p flag is used to specify which host port will be connected to the
            inside port of docker
   -d running in daemon mode

7. docker run -it -d -p 3000:3000 <imageName:tag> 




