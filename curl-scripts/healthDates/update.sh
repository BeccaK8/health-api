#!/bin/bash

API="http://localhost:8000"
URL_PATH="/dates"

curl "${API}${URL_PATH}/${ID}" \
    --include \
    --request PATCH \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${TOKEN}" \
    --data '{
        "healthDate": {
            "goalStatement": "We can do this",
            "focusArea": "Strength"
        }
    }'

echo
