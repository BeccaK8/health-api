#!/bin/bash

API="http://localhost:8000"
URL_PATH="/dates"

curl "${API}${URL_PATH}/${ID}" \
    --include \
    --request DELETE \
    --header "Authorization: Bearer ${TOKEN}"

echo
