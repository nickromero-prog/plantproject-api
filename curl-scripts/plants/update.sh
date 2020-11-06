#!/bin/bash

API="http://localhost:4741"
URL_PATH="/plants"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "plant": {
      "name": "'"${NAME}"'",
      "light": "'"${LIGHT}"'",
      "water": "'"${WATER}"'"
    }
  }'

echo
