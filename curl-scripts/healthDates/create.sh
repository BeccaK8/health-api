#!/bin/bash

API="http://localhost:8000"
URL_PATH="/dates"

curl "${API}${URL_PATH}" \
    --include \
    --request POST \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${TOKEN}" \
    --data '{
        "healthDate": {
            "dateString": "2024-02-13", 
            "goalStatement": "Survive the week",
            "focusArea": "Endurance"
        }
    }'

echo
