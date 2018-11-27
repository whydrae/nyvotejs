#!/bin/bash

shuffle() {
   local i tmp size max rand

   # $RANDOM % (i+1) is biased because of the limited range of $RANDOM
   # Compensate by using a range which is a multiple of the array size.
   size=${#array[*]}
   max=$(( 32768 / size * size ))

   for ((i=size-1; i>0; i--)); do
      while (( (rand=$RANDOM) >= max )); do :; done
      rand=$(( rand % (i+1) ))
      tmp=${array[i]} array[i]=${array[rand]} array[rand]=$tmp
   done
}

# Test users
array=( 'lera ' 'alex ' 'olya ' 'ilya ' 'rodik ' 'nat ' 'sveta ' )
shuffle
printf "%s" "${array[@]}"
printf "\n"

names=${array[@]}

echo "\n Reset results"

content=$(curl -s -c mycookie -H "Accept: application/json" -H \
"Content-type: application/json" -X POST \
-d '{"username": "ilya", "password": "testpwd"}' \
http://localhost:8080/user/login)
echo $content | jq .status

content=$(curl -s -b mycookie -H "Accept: application/json" -H \
"Content-type: application/json" -X POST \
http://localhost:8080/santa/reset)
echo $content | jq .status

content=$(curl -s -H "Accept: application/json" -H \
"Content-type: application/json" -X GET \
http://localhost:8080/user/logout)
echo $content | jq .status

for name in $names
do
  echo "\n" $name

  content=$(curl -s -c mycookie -H "Accept: application/json" -H \
  "Content-type: application/json" -X POST \
  -d '{"username": "'$name'", "password": "testpwd"}' \
  http://localhost:8080/user/login)
  echo $content | jq .status

  content=$(curl -s -b mycookie -H "Accept: application/json" -H \
  "Content-type: application/json" -X POST \
  http://localhost:8080/santa/recipient)
  echo $content | jq .status

  content=$(curl -s -b mycookie -H "Accept: application/json" -H \
  "Content-type: application/json" -X GET \
  http://localhost:8080/santa/recipient)
  echo $content | jq .recipient.username

  content=$(curl -s -b mycookie -H "Accept: application/json" -H \
  "Content-type: application/json" -X GET \
  http://localhost:8080/user/logout)
  echo $content | jq .status

done

echo "\n Check results"

content=$(curl -s -c mycookie -H "Accept: application/json" -H \
"Content-type: application/json" -X POST \
-d '{"username": "ilya", "password": "testpwd"}' \
http://localhost:8080/user/login)
echo $content | jq .status

content=$(curl -s -b mycookie -H "Accept: application/json" -H \
"Content-type: application/json" -X POST \
http://localhost:8080/santa/check)
echo $content | jq .status

content=$(curl -s -b mycookie -H "Accept: application/json" -H \
"Content-type: application/json" -X GET \
http://localhost:8080/user/logout)
echo $content | jq .status
